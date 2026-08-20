import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";
import { quoteSwap, swapAssets } from "@/lib/services/spotTradingService";

// GET /api/trade/swap?from=BTC&to=ETH&amount=0.5  → live quote (no execution)
export async function GET(req: Request) {
  try {
    requireUser(req);
    const { searchParams } = new URL(req.url);
    const quote = await quoteSwap(
      searchParams.get("from"),
      searchParams.get("to"),
      searchParams.get("amount")
    );
    return NextResponse.json({ success: true, quote });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/trade/swap { from, to, amount }  → execute the swap at live rates
export async function POST(req: Request) {
  try {
    const auth = requireUser(req);
    const body = await req.json().catch(() => ({}));
    const result = await swapAssets(auth.userIdNum, body?.from, body?.to, body?.amount);
    return NextResponse.json({ success: true, swap: result });
  } catch (error) {
    return handleApiError(error);
  }
}
