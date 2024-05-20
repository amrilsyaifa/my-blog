import createMiddleware from "next-intl/middleware";
import { Locale } from "./constants/locale";

export default createMiddleware({
  // A list of all locales that are supported
  locales: Locale,

  // Used when no locale matches
  defaultLocale: "en",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(id|en)/:path*"],
};
