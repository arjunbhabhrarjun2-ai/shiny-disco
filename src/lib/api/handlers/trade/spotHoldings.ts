import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";
import { getHoldings } from "@/lib/services/spotTradingService";

// GET /api/trade/spot/holdings — the authenticated user's quote balance (USDT,
// from mainBalance) plus per-asset base holdings.
export async function GET(req: Request) {
  try {
    const auth = requireUser(req);
    const data = await getHoldings(auth.userIdNum);
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return handleApiError(error);
  }
}
