import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { Locale } from "../constants/locale";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: Locale,

  // Used when no locale matches
  defaultLocale: "en",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);