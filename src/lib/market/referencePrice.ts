// src/lib/market/referencePrice.ts
//
// Live pricing for all markets via a single, cached CoinGecko bulk call. Every
// consumer (ticker, order book, tape, candles, trading engine) shares the same
// 45s-cached snapshot, so 65+ markets cost one upstream request — not 65 — which
// keeps us well under CoinGecko's free-tier rate limit. Falls back to each
// market's static `reference` price if the feed is unavailable, so nothing ever
// hard-fails on a flaky network.

import { MARKETS, getMarket } from "./symbols";

export interface PriceInfo {
  price: number;
  change24h: number;
  volume24h: number;
}

const BULK_TTL_MS = 45_000;
let cache: { at: number; data: Map<string, PriceInfo> } | null = null;
let inflight: Promise<Map<string, PriceInfo>> | null = null;

function fallbackMap(): Map<string, PriceInfo> {
  const m = new Map<string, PriceInfo>();
  for (const market of MARKETS) {
    m.set(market.symbol, { price: market.reference, change24h: 0, volume24h: 0 });
  }
  return m;
}

async function fetchBulk(): Promise<Map<string, PriceInfo>> {
  const data = fallbackMap();
  try {
    const ids = MARKETS.map((m) => m.coingeckoId).join(",");
    const url =
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}` +
      `&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
    const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (res.ok) {
      const json = (await res.json()) as Record<
        string,
        { usd?: number; usd_24h_change?: number; usd_24h_vol?: number }
      >;
      for (const market of MARKETS) {
        const d = json[market.coingeckoId];
        if (d && typeof d.usd === "number" && d.usd > 0) {
          data.set(market.symbol, {
            price: d.usd,
            change24h: d.usd_24h_change ?? 0,
            volume24h: d.usd_24h_vol ?? 0,
          });
        }
      }
    }
  } catch {
    /* keep fallback */
  }
  return data;
}

/** Returns a cached snapshot of live prices for every market. Never throws. */
export async function getBulkPrices(): Promise<Map<string, PriceInfo>> {
  const now = Date.now();
  if (cache && now - cache.at < BULK_TTL_MS) return cache.data;
  if (inflight) return inflight;
  inflight = (async () => {
    const data = await fetchBulk();
    cache = { at: Date.now(), data };
    inflight = null;
    return data;
  })();
  return inflight;
}

/** Live reference price for a single symbol (from the shared bulk snapshot). */
export async function getReferencePrice(symbol: string): Promise<number> {
  const market = getMarket(symbol);
  if (!market) throw new Error(`Unknown symbol: ${symbol}`);
  const bulk = await getBulkPrices();
  return bulk.get(market.symbol)?.price ?? market.reference;
}
