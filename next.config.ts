import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Baseline security headers applied to every response. The CSP below is a
// static (non-nonce) policy — good enough to block third-party script/asset
// injection from a stray XSS, but 'unsafe-inline' is still needed for style
// (the UI uses inline `style={{}}` in several components) and, in dev only,
// 'unsafe-eval' is required by webpack's Fast Refresh. A stricter nonce-based
// CSP that drops both is a later phase.
// 'unsafe-inline' is also required for script: Next.js emits inline bootstrap /
// RSC-payload <script> tags, and without a nonce the browser blocks them, so
// the page never hydrates and the splash screen stays up forever.
const isProd = process.env.NODE_ENV === "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://lh3.googleusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  // The media gallery embeds YouTube videos and lets admins link arbitrary
  // external video files.
  "frame-src https://www.youtube.com",
  "media-src 'self' https:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the project root so Turbopack ignores the package-lock.json in the
  // user's home directory (OneDrive/Desktop path sits under C:\Users\...).
  turbopack: { root: import.meta.dirname },
  // This machine has very limited RAM; spawning extra node.exe child
  // processes for static generation crashes with OOM ("Jest worker
  // encountered child process exceptions"). Use worker_threads (shares the
  // parent's process memory) instead of forking a full child process.
  experimental: { cpus: 1, workerThreads: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
