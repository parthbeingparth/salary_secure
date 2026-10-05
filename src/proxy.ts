import { NextResponse, type NextRequest } from "next/server";

/**
 * Fast-reject vulnerability-scanner traffic.
 * Netlify "HTML error %" spikes are almost entirely bots hitting WP/.env/.git
 * paths — not broken Salary Secure pages.
 */
const PROBE_PATTERN =
  /(?:^|\/)(?:\.env|\.git|\.aws|\.npmrc|\.docker|\.claude|\.boto|\.s3cfg|\.amplifyrc)(?:$|[./_-])|(?:^|\/)(?:wp(?:-|$)|wordpress|xmlrpc|wlwmanifest|phpinfo|vendor\/composer|docker-compose|dockerfile|credentials|appsettings|aws-exports|composer\.json|database\.sql|sendgrid\.env|runtime-config|env-config|config\.ya?ml|config\.json|config\.php|config\.js|config\.env)(?:$|[./_-])/i;

function normalizePath(pathname: string): string {
  // Collapse //wordpress/... style scanner paths
  return pathname.replace(/\/{2,}/g, "/");
}

function isProbePath(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (path === "/" || path.length < 2) return false;

  // Real public assets / pages we serve
  if (
    path === "/__forms.html" ||
    path === "/site.webmanifest" ||
    path.startsWith("/favicon") ||
    path.startsWith("/icon-") ||
    path.startsWith("/apple-touch")
  ) {
    return false;
  }

  const lower = path.toLowerCase();

  // This app has no PHP/ASP — any such request is a probe
  if (/\.(?:php|asp|aspx|cgi|jsp)(?:$|\/)/i.test(lower)) {
    return true;
  }

  return PROBE_PATTERN.test(path);
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
