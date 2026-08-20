// src/lib/trade/otcQuote.ts
//
// Short-lived, HMAC-signed OTC quotes. A quote binds {symbol, side, size, price}
// and expires (default 15s). The client cannot tamper with the price, and an
// expired quote can't be executed — the same pattern as approvalToken, scoped
// to RFQ. Signed with JWT_SECRET (server-only).

import { createHmac, timingSafeEqual } from "crypto";
import type { OrderSide } from "@/lib/services/spotEngine";

const DEFAULT_TTL_SECONDS = 15;

export interface OtcQuoteData {
  symbol: string;
  side: OrderSide;
  size: number;
  price: number;
  exp: number;
}

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not configured");
  return s;
}

function sign(message: string): string {
  return createHmac("sha256", secret()).update(message).digest("hex");
}

export function createOtcQuote(
  data: Omit<OtcQuoteData, "exp">,
  ttlSeconds = DEFAULT_TTL_SECONDS
): { token: string; expiresAt: string } {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = JSON.stringify({ ...data, exp });
  const encoded = Buffer.from(payload).toString("base64url");
  const token = `${encoded}.${sign(encoded)}`;
  return { token, expiresAt: new Date(exp * 1000).toISOString() };
}

export function verifyOtcQuote(
  token: string | null | undefined
): { valid: boolean; data?: OtcQuoteData; reason?: string } {
  if (!token || !token.includes(".")) return { valid: false, reason: "malformed" };
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return { valid: false, reason: "malformed" };

  const expectedSig = sign(encoded);
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "bad_signature" };
  }

  let data: OtcQuoteData;
  try {
    data = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "malformed" };
  }
  if (!Number.isFinite(data.exp) || data.exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, reason: "expired" };
  }
  return { valid: true, data };
}
