import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// AES-256-GCM helpers for encrypting sensitive fields before they're written
// to the database (e.g. a future registration form's phone/ID data). Not
// wired into any model yet — call encryptField()/decryptField() from a
// server action or lib helper when such a field is added.

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // recommended nonce size for GCM

function getKey(): Buffer {
  const raw = process.env.FIELD_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "FIELD_ENCRYPTION_KEY is not set. Add a 32-byte base64url key to .env before encrypting/decrypting fields.",
    );
  }
  const key = Buffer.from(raw, "base64url");
  if (key.length !== 32) {
    throw new Error("FIELD_ENCRYPTION_KEY must decode to exactly 32 bytes (AES-256).");
  }
  return key;
}

/** Encrypt a plaintext string. Returns "iv:authTag:ciphertext" (all base64url). */
export function encryptField(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, ciphertext].map((b) => b.toString("base64url")).join(":");
}

/** Reverse of encryptField(). Throws if the value was tampered with or the key is wrong. */
export function decryptField(stored: string): string {
  const key = getKey();
  const [ivB64, authTagB64, ciphertextB64] = stored.split(":");
  if (!ivB64 || !authTagB64 || !ciphertextB64) {
    throw new Error("Malformed encrypted field value.");
  }
  const iv = Buffer.from(ivB64, "base64url");
  const authTag = Buffer.from(authTagB64, "base64url");
  const ciphertext = Buffer.from(ciphertextB64, "base64url");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}
