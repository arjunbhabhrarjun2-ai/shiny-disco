import { NextRequest, NextResponse } from "next/server";
import { getMarket } from "@/lib/market/symbols";
import { getReferencePrice } from "@/lib/market/referencePrice";

type Trade = {
  id: string;
  symbol: string;
  price: number;
  size: number;
  side: "buy" | "sell";
  timestamp: string;
};

// Recent prints. Synthetic, but anchored to the live reference price so the tape
// reflects the real market. (Replace with a venue trade feed in production.)
export async function GET(req: NextRequest) {
  const symbolParam = (req.nextUrl.searchParams.get("symbol") || "BTCUSDT").toUpperCase();
  const market = getMarket(symbolParam) ?? getMarket("BTCUSDT")!;
  const limitParam = Number(req.nextUrl.searchParams.get("limit") || 20);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20;

  const base = await getReferencePrice(market.symbol);
  const now = Date.now();
  const trades: Trade[] = Array.from({ length: limit }).map((_, i) => {
    const side: "buy" | "sell" = Math.random() > 0.5 ? "buy" : "sell";
    const drift = (Math.random() - 0.5) * base * 0.0008;
    const price = Number((base + drift).toFixed(market.priceDecimals));
    const size = Number((Math.random() * 2 + 0.01).toFixed(market.sizeDecimals));
    const timestamp = new Date(now - i * 4000).toISOString();
    return { id: `${market.symbol}-${now}-${i}`, symbol: market.symbol, price, size, side, timestamp };
  });

  return NextResponse.json({ symbol: market.symbol, trades });
}
