import { NextRequest, NextResponse } from "next/server";
import { getMarket } from "@/lib/market/symbols";
import { getReferencePrice } from "@/lib/market/referencePrice";

// Candle interval -> { seconds per candle, number of candles, per-candle volatility }
const INTERVALS: Record<string, { step: number; count: number; vol: number }> = {
  "1H": { step: 3600, count: 72, vol: 0.012 },
  "4H": { step: 4 * 3600, count: 90, vol: 0.02 },
  "1D": { step: 24 * 3600, count: 120, vol: 0.03 },
  "1W": { step: 7 * 24 * 3600, count: 80, vol: 0.06 },
};

type Candle = { time: number; open: number; high: number; low: number; close: number };

// Synthetic-but-realistic OHLC anchored so the latest close equals the live
// reference price. Deterministic per (symbol, interval, hour) so the chart is
// stable across polls within the hour. Replace with a venue OHLC feed for a
// true exchange.
function buildCandles(reference: number, interval: { step: number; count: number; vol: number }, decimals: number, seed: number): Candle[] {
  // Tiny seeded PRNG (mulberry32) for stable output.
  let s = seed >>> 0;
  const rand = () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const { step, count, vol } = interval;
  const closes: number[] = [reference];
  for (let i = 1; i < count; i++) {
    closes.push(closes[i - 1] * (1 + (rand() - 0.5) * vol));
  }
  closes.reverse(); // oldest first; last element stays = reference

  const now = Math.floor(Date.now() / 1000);
  const r = (n: number) => Number(n.toFixed(decimals));

  return closes.map((close, i) => {
    const open = i === 0 ? close * (1 + (rand() - 0.5) * vol * 0.5) : closes[i - 1];
    const high = Math.max(open, close) * (1 + rand() * vol * 0.5);
    const low = Math.min(open, close) * (1 - rand() * vol * 0.5);
    return {
      time: now - (count - 1 - i) * step,
      open: r(open),
      high: r(high),
      low: r(low),
      close: r(close),
    };
  });
}

export async function GET(req: NextRequest) {
  const symbolParam = (req.nextUrl.searchParams.get("symbol") || "BTCUSDT").toUpperCase();
  const intervalKey = (req.nextUrl.searchParams.get("interval") || "1H").toUpperCase();
  const market = getMarket(symbolParam) ?? getMarket("BTCUSDT")!;
  const interval = INTERVALS[intervalKey] ?? INTERVALS["1H"];

  const reference = await getReferencePrice(market.symbol);

  // Stable seed within the hour so the historical part of the chart doesn't
  // jitter on every refetch (only the live last candle updates client-side).
  const hourBucket = Math.floor(Date.now() / 3_600_000);
  let seed = hourBucket;
  for (const ch of `${market.symbol}:${intervalKey}`) seed = (seed * 31 + ch.charCodeAt(0)) | 0;

  const candles = buildCandles(reference, interval, market.priceDecimals, seed);

  return NextResponse.json({ symbol: market.symbol, interval: intervalKey, candles });
}
