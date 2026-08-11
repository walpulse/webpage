import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, and static files (with a dot).
  matcher: ["/", "/(es|pt|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
