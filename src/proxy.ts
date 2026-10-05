import { NextResponse, type NextRequest } from "next/server";

/**
 * Fast-reject common vulnerability scanner paths.
 * Logs showing /.env, /.git, wp-login, phpinfo, etc. are bots — not app bugs.
 * Returning 404 here avoids spinning up the full Next.js page for those probes.
 */
const PROBE_PATTERN =
  /(?:^|\/)(?:\.env|\.git|\.aws|\.npmrc|\.docker|\.claude|\.boto|\.s3cfg|\.amplifyrc)(?:$|[./_-])|(?:^|\/)(?:wp-admin|wp-login|wp-content|wp-config|phpinfo|vendor\/composer|docker-compose|dockerfile|credentials|appsettings|aws-exports|composer\.json|database\.sql|sendgrid\.env|runtime-config|env-config|config\.ya?ml|config\.json|config\.php|config\.js|config\.env)(?:$|[./_-])/i;

function isProbePath(pathname: string): boolean {
  if (pathname === "/" || pathname.length < 2) return false;
  // Allow our real public assets and pages.
  if (
    pathname === "/__forms.html" ||
    pathname === "/site.webmanifest" ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon-") ||
    pathname.startsWith("/apple-touch")
  ) {
    return false;
  }
  return PROBE_PATTERN.test(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // WordPress REST probe: POST /?rest_route=/batch/v1
  if (searchParams.has("rest_route")) {
    return new NextResponse(null, { status: 404 });
  }

  if (isProbePath(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Skip Next internals and common static file extensions.
     * Probe paths still match and get a cheap 404.
     */
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|css|js|map|webmanifest)$).*)",
  ],
};
