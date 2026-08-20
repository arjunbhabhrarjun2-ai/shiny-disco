// src/lib/approvalToken.ts
//
// HMAC-signed, expiring tokens for one-click admin approve/reject actions.
// A token binds {resource, id, action} together and expires, so a leaked link
// for "approve withdrawal 12" cannot be replayed for a different id/action and
// stops working after the TTL. Tokens are verified server-side with a constant-
// time comparison.

import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 3; // 3 days

export type ApprovalResource = "withdrawal" | "deposit";
export type ApprovalAction = "approve" | "reject";

function secret(): string {
  const s = process.env.ADMIN_APPROVAL_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_APPROVAL_SECRET is not configured (set a 32+ char random value)"
    );
  }
  return s;
}

function sign(message: string): string {
  return createHmac("sha256", secret()).update(message).digest("hex");
}

function payloadString(
  resource: ApprovalResource,
  id: number,
  action: ApprovalAction,
  exp: number
): string {
  return `${resource}:${id}:${action}:${exp}`;
}

/** Create a signed token. Format: base64url(payload).signature */
export function createApprovalToken(
  resource: ApprovalResource,
  id: number,
  action: ApprovalAction,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = payloadString(resource, id, action, exp);
  const sig = sign(payload);
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sig}`;
}

export interface ApprovalTokenResult {
  valid: boolean;
  reason?: "malformed" | "bad_signature" | "expired" | "mismatch";
}

/**
 * Verify a token matches the expected resource/id/action and has not expired.
 * Returns a structured result instead of throwing so callers can log reasons.
 */
export function verifyApprovalToken(
  token: string | null | undefined,
  expected: { resource: ApprovalResource; id: number; action: ApprovalAction }
): ApprovalTokenResult {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, reason: "malformed" };
  }
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return { valid: false, reason: "malformed" };

  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return { valid: false, reason: "malformed" };
  }

  const expectedSig = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "bad_signature" };
  }

  const parts = payload.split(":");
  if (parts.length !== 4) return { valid: false, reason: "malformed" };
  const [resource, idStr, action, expStr] = parts;
  const exp = Number(expStr);

  if (
    resource !== expected.resource ||
    Number(idStr) !== expected.id ||
    action !== expected.action
  ) {
    return { valid: false, reason: "mismatch" };
  }
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, reason: "expired" };
  }
  return { valid: true };
}
