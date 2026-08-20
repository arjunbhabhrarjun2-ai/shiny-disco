import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authz";
import { handleApiError, AppError } from "@/lib/errorHandler";
import { getMarket } from "@/lib/market/symbols";
import { getReferencePrice } from "@/lib/market/referencePrice";
import { createOtcQuote } from "@/lib/trade/otcQuote";
import { roundMoney } from "@/lib/utils/money";

const OTC_SPREAD = 0.002; // 0.20% embedded spread (no explicit fee)

// POST /api/trade/otc/quote { symbol, side, notional }  (notional in quote ccy)
// Returns a signed, 15-second executable quote.
export async function POST(req: Request) {
  try {
    requireUser(req);
    const body = await req.json().catch(() => null);
    const symbol = String(body?.symbol || "").toUpperCase();
    const side = String(body?.side || "").toLowerCase();
    const notional = Number(body?.notional);

    const market = getMarket(symbol);
    if (!market) throw new AppError("Unsupported pair", 400, "BAD_SYMBOL");
    if (side !== "buy" && side !== "sell") throw new AppError("Invalid side", 400, "BAD_SIDE");
    if (!Number.isFinite(notional) || notional <= 0) {
      throw new AppError("Notional must be positive", 400, "BAD_NOTIONAL");
    }

    const reference = await getReferencePrice(symbol);
    // Buyers pay slightly above mid; sellers receive slightly below (spread).
    const price = roundMoney(side === "buy" ? reference * (1 + OTC_SPREAD) : reference * (1 - OTC_SPREAD));
    const size = Number((notional / price).toFixed(market.sizeDecimals));
    if (!(size > 0)) throw new AppError("Notional too small for this asset", 400, "BAD_NOTIONAL");

    const { token, expiresAt } = createOtcQuote({ symbol: market.symbol, side, size, price });

    return NextResponse.json({
      success: true,
      quote: {
        token,
        symbol: market.symbol,
        base: market.base,
        quote: market.quote,
        side,
        size,
        price,
        notional: roundMoney(size * price),
        expiresAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
