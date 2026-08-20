// src/lib/authz.ts
//
// Central authorization helpers. These derive the caller's identity from a
// verified Bearer JWT (NEVER from a client-supplied userId/email), which is the
// fix for the pervasive IDOR issues found in the audit.
//
// Usage in a route handler:
//   const auth = await requireUser(req);        // throws AppError(401) if missing/invalid
//   const auth = await requireAdmin(req);        // throws AppError(403) if not admin
//   if (auth.userIdNum !== resourceUserId) throw new AppError("Forbidden", 403);
//
// All throws are AppError instances; wrap handlers with withErrorHandling (or
// catch AppError) to produce a consistent JSON error envelope.
//
// Admin status is determined solely by the JWT `role` field (which comes from
// the DB user record). There is no email-based fallback.

import { AuthService, JWTPayload } from "./auth";
import { AppError } from "./errorHandler";
import { logSecurityEvent } from "./logger";

export interface AuthContext {
  payload: JWTPayload;
  userId: string;
  userIdNum: number;
  email: string;
  role: string;
  isAdmin: boolean;
}

function extractBearer(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.substring(7).trim();
  return token.length > 0 ? token : null;
}

/**
 * Returns the verified auth context, or null if no/invalid token.
 * Does not throw — use for optional auth.
 */
export function getAuthUser(req: Request): AuthContext | null {
  const token = extractBearer(req);
  if (!token) return null;

  try {
    const payload = AuthService.verifyAccessToken(token);
    const email = (payload.email || "").toLowerCase();
    const role = payload.role || "user";
    return {
      payload,
      userId: String(payload.userId),
      userIdNum: Number(payload.userId),
      email,
      role,
      isAdmin: role === "admin",
    };
  } catch {
    return null;
  }
}

/** Requires a valid authenticated user. Throws AppError(401) otherwise. */
export function requireUser(req: Request): AuthContext {
  const auth = getAuthUser(req);
  if (!auth) {
    logSecurityEvent("unauthenticated_request", {
      path: new URL(req.url).pathname,
      method: req.method,
    });
    throw new AppError("Authentication required", 401, "UNAUTHENTICATED");
  }
  return auth;
}

/** Requires an authenticated admin. Throws AppError(401/403) otherwise. */
export function requireAdmin(req: Request): AuthContext {
  const auth = requireUser(req);
  if (!auth.isAdmin) {
    logSecurityEvent("admin_authz_denied", {
      userId: auth.userId,
      email: auth.email,
      path: new URL(req.url).pathname,
      method: req.method,
    });
    throw new AppError("Admin privileges required", 403, "FORBIDDEN");
  }
  return auth;
}

/**
 * Resolve the effective target userId for a user-scoped request.
 * Non-admins may only act on their own id; admins may target any id via
 * `requestedUserId`. Prevents IDOR while preserving admin functionality.
 */
export function resolveTargetUserId(
  auth: AuthContext,
  requestedUserId?: number | string | null
): number {
  if (requestedUserId == null || requestedUserId === "") {
    return auth.userIdNum;
  }
  const requested = Number(requestedUserId);
  if (Number.isNaN(requested)) {
    throw new AppError("Invalid user id", 400, "BAD_REQUEST");
  }
  if (!auth.isAdmin && requested !== auth.userIdNum) {
    logSecurityEvent("idor_attempt_blocked", {
      userId: auth.userId,
      requestedUserId: requested,
    });
    throw new AppError("Access denied", 403, "FORBIDDEN");
  }
  return requested;
}
