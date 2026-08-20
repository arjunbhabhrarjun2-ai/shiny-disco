import { NextRequest, NextResponse } from "next/server";
import { MARKETS, getMarket, type MarketSymbol } from "@/lib/market/symbols";
import { getBulkPrices, type PriceInfo } from "@/lib/market/referencePrice";

function toTicker(m: MarketSymbol, bulk: Map<string, PriceInfo>) {
  const p = bulk.get(m.symbol);
  return {
    symbol: m.symbol,
    base: m.base,
    quote: m.quote,
    name: m.name,
    price: Number((p?.price ?? m.reference).toFixed(m.priceDecimals)),
    change24h: Number((p?.change24h ?? 0).toFixed(2)),
    volume24h: Math.round(p?.volume24h ?? 0),
  };
}

// Live tickers for all 65+ markets (or a single symbol / base) via one cached
// upstream price call.
export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol")?.toUpperCase();
  const bulk = await getBulkPrices();

  if (!symbol) {
    return NextResponse.json({ symbol: null, tickers: MARKETS.map((m) => toTicker(m, bulk)) });
  }
  const direct = getMarket(symbol);
  if (direct) return NextResponse.json({ symbol, tickers: [toTicker(direct, bulk)] });

  const byBase = MARKETS.filter((m) => m.base === symbol);
  return NextResponse.json({ symbol, tickers: byBase.map((m) => toTicker(m, bulk)) });
}
