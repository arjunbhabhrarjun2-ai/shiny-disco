// src/middleware.ts
//
// Root middleware: applies security headers to every response and throttles the
// most sensitive API paths (auth, withdrawals, deposits). This is the central
// request pipeline the app previously lacked.
//
// NOTE on CSP: a strict Content-Security-Policy is intentionally NOT set here
// because the app relies heavily on inline styles / animation libraries and a
// wrong CSP would break the UI. Add a tested CSP (start in report-only mode)
// as a follow-up — see SECURITY_REMEDIATION.md.

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RATE_LIMITS, clientIp } from "@/lib/rateLimiter";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-DNS-Prefetch-Control": "off",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  // HSTS is safe behind HTTPS; harmless over http during local dev.
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function withSecurityHeaders(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

function limitFor(pathname: string) {
  if (pathname.startsWith("/api/auth")) return { name: "auth", cfg: RATE_LIMITS.auth };
  if (pathname.startsWith("/api/withdrawal")) return { name: "withdrawal", cfg: RATE_LIMITS.withdrawal };
  if (pathname.startsWith("/api/addFunds")) return { name: "transaction", cfg: RATE_LIMITS.transaction };
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Throttle sensitive endpoints.
  const limit = limitFor(pathname);
  if (limit) {
    const id = `${limit.name}:${clientIp(req)}`;
    const result = rateLimit(id, limit.cfg);
    if (!result.allowed) {
      const res = NextResponse.json(
        {
          success: false,
          message: "Too many requests, please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
      res.headers.set("Retry-After", String(result.retryAfterSeconds));
      res.headers.set("X-RateLimit-Limit", String(result.limit));
      res.headers.set("X-RateLimit-Remaining", String(result.remaining));
      return withSecurityHeaders(res);
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

// Apply to all routes except Next internals and static assets.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)"],
};
