import { readFile } from "fs/promises";
import path from "path";

// Files uploaded from the admin panel are written to public/uploads while the
// server is running. `next start` only serves files that were in public/ at
// startup, so uploads made later would 404 — this route serves them from disk
// at request time instead.
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await ctx.params;
  const root = path.join(process.cwd(), "public", "uploads");
  const file = path.resolve(root, ...segments);

  // Stay inside public/uploads (no ../ traversal, no absolute segments).
  if (!file.startsWith(root + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type) return new Response("Not found", { status: 404 });

  try {
    const data = await readFile(file);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        // Upload names are unique (timestamp + random), so they never change.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
