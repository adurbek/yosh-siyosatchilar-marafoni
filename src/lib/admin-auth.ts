import "server-only";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHmac,
} from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "admin_session";
const DEFAULT_PASSWORD = "admin123";
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "insecure-dev-secret";

/* ── Password hashing (scrypt) ── */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const test = scryptSync(password, salt, 64);
  return hashBuf.length === test.length && timingSafeEqual(hashBuf, test);
}

/* ── Settings row (single admin password), seeded on first use ── */

async function getSettings() {
  let settings = await prisma.adminSettings.findFirst();
  if (!settings) {
    settings = await prisma.adminSettings.create({
      data: { id: 1, passwordHash: hashPassword(DEFAULT_PASSWORD) },
    });
  }
  return settings;
}

export async function checkPassword(password: string): Promise<boolean> {
  const settings = await getSettings();
  return verifyPassword(password, settings.passwordHash);
}

export async function updatePassword(newPassword: string): Promise<void> {
  await getSettings();
  await prisma.adminSettings.update({
    where: { id: 1 },
    data: { passwordHash: hashPassword(newPassword) },
  });
}

/* ── Signed session token stored in an httpOnly cookie ── */

function sign(data: string): string {
  return createHmac("sha256", SECRET).update(data).digest("base64url");
}

function createToken(): string {
  const data = Buffer.from(JSON.stringify({ v: 1, iat: Date.now() })).toString(
    "base64url",
  );
  return `${data}.${sign(data)}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;
  const expected = sign(data);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidToken(store.get(COOKIE_NAME)?.value);
}
