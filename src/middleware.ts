import createMiddleware from "next-intl/middleware";
import { Locale } from "./constants/locale";

export default createMiddleware({
  locales: Locale,
  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(id|en)/:path*"],
};
