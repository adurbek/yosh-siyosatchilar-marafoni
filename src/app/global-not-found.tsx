import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { NotFoundView } from "@/components/layout/NotFoundView";
import "./globals.css";

// Unmatched URLs skip the [locale] layout entirely, so this file must be a full
// HTML document and pull in the global styles / font itself.
const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 Not Found",
};

export default function GlobalNotFound() {
  return (
    <html lang="uz" className={`${roboto.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-on-surface font-body antialiased">
        <NotFoundView />
      </body>
    </html>
  );
}
