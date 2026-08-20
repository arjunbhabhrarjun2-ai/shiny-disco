import { NextResponse } from "next/server";

// Live USD→EUR/GBP rates from frankfurter.app (no API key), cached 1h, with a
// static fallback so conversion always works offline.
let cache: { at: number; rates: Record<string, number> } | null = null;
const TTL_MS = 60 * 60 * 1000;
const FALLBACK: Record<string, number> = { USD: 1, EUR: 0.86103, GBP: 0.7445 };

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) {
    return NextResponse.json({ base: "USD", rates: cache.rates, source: "cache" });
  }

  let rates = { ...FALLBACK };
  let source = "fallback";
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=EUR,GBP", {
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const j = (await res.json()) as { rates?: { EUR?: number; GBP?: number } };
      if (j?.rates?.EUR && j?.rates?.GBP) {
        rates = { USD: 1, EUR: j.rates.EUR, GBP: j.rates.GBP };
        source = "live";
      }
    }
  } catch {
    /* keep fallback */
  }

  cache = { at: now, rates };
  return NextResponse.json({ base: "USD", rates, source });
}
