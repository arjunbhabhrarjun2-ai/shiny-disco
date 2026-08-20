import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authz";
import { handleApiError, AppError } from "@/lib/errorHandler";
import { verifyOtcQuote } from "@/lib/trade/otcQuote";
import { placeOrder } from "@/lib/services/spotTradingService";

// POST /api/trade/otc/accept { token }
// Verifies the signed quote (unexpired, untampered) and executes it at the
// quoted price via the shared engine (a marketable limit at the quote price).
export async function POST(req: Request) {
  try {
    const auth = requireUser(req);
    const body = await req.json().catch(() => null);
    const result = verifyOtcQuote(body?.token);
    if (!result.valid || !result.data) {
      const msg = result.reason === "expired" ? "Quote expired — request a new one" : "Invalid quote";
      throw new AppError(msg, 400, "BAD_QUOTE");
    }

    const { symbol, side, size, price } = result.data;
    const order = await placeOrder(
      auth.userIdNum,
      { symbol, side, type: "limit", price, size, product: "spot" },
      { forceFillPrice: price } // guarantee execution at the quoted price
    );

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return handleApiError(error);
  }
}
