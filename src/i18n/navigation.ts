import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Lightweight wrappers around Next.js navigation APIs that keep the
// active locale in mind. Use these instead of importing from "next/link"
// or "next/navigation" directly.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
