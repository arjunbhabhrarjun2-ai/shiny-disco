// src/lib/clientAuth.ts
// Client-side fetch helper that attaches the Bearer access token to requests.
// Use this for any call to an authenticated API route so the server can derive
// the user from the verified token instead of a client-supplied id (IDOR fix).
//
// NOTE: tokens currently live in localStorage to match the existing app. A
// follow-up hardening step is to move them to httpOnly Secure SameSite cookies
// (XSS-resistant); this helper centralizes the call sites to make that swap easy.

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

export function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = getAccessToken();
  return {
    ...(extra || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const SIGNIN_PATH = "/screens/auth/Signin";
let redirecting = false;

/**
 * Clear the stored session and send the user to sign in. Called when an
 * authenticated request comes back 401 (expired/invalid token) so the app
 * recovers gracefully instead of looping on errors. Guarded so we redirect once.
 */
export function handleAuthExpiry(): void {
  if (typeof window === "undefined" || redirecting) return;
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("currentUser");
  } catch {
    /* ignore storage errors */
  }
  if (!window.location.pathname.startsWith(SIGNIN_PATH)) {
    redirecting = true;
    window.location.assign(SIGNIN_PATH);
  }
}

/**
 * fetch() wrapper that injects the Authorization header automatically and, on a
 * 401, clears the session and redirects to sign-in.
 */
export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const res = await fetch(input, {
    ...init,
    headers: authHeaders(init.headers),
  });
  if (res.status === 401) handleAuthExpiry();
  return res;
}
