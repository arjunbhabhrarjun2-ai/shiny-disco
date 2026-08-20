import { NextRequest, NextResponse } from "next/server";
import { getMarket } from "@/lib/market/symbols";
import { getReferencePrice } from "@/lib/market/referencePrice";

type Level = { price: number; size: number; total: number };

const mkLevels = (mid: number, depth: number, side: "ask" | "bid", decimals: number): Level[] => {
  const out: Level[] = [];
  let running = 0;
  for (let i = 1; i <= depth; i++) {
    const step = mid * 0.0002 * i;
    const price = side === "ask" ? mid + step : mid - step;
    const size = Number((Math.random() * 4 + 0.05).toFixed(3));
    running += size;
    out.push({
      price: Number(price.toFixed(decimals)),
      size,
      total: Number(running.toFixed(3)),
    });
  }
  return out;
};

// L2 order book. Depth/sizes are synthetic, but the mid is anchored to the live
// reference price so the book tracks the real market. (A production deployment
// would replace this with a streaming venue feed.)
export async function GET(req: NextRequest) {
  const symbolParam = (req.nextUrl.searchParams.get("symbol") || "BTCUSDT").toUpperCase();
  const market = getMarket(symbolParam) ?? getMarket("BTCUSDT")!;
  const depthParam = Number(req.nextUrl.searchParams.get("depth") || 10);
  const depth = Number.isFinite(depthParam) ? Math.min(Math.max(depthParam, 1), 30) : 10;

  const mid = await getReferencePrice(market.symbol);
  const asks = mkLevels(mid, depth, "ask", market.priceDecimals);
  const bids = mkLevels(mid, depth, "bid", market.priceDecimals);
  const spread = Number((asks[0].price - bids[0].price).toFixed(market.priceDecimals));

  return NextResponse.json({
    symbol: market.symbol,
    asks,
    bids,
    mid: Number(mid.toFixed(market.priceDecimals)),
    spread,
    updatedAt: new Date().toISOString(),
  });
}
