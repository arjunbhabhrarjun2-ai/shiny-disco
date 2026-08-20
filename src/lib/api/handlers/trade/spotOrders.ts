import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";
import { placeOrder, listOrders } from "@/lib/services/spotTradingService";

// GET /api/trade/spot/orders?symbol=&status=&product=&limit=&offset=
// Returns ONLY the authenticated user's orders (no cross-user access).
export async function GET(req: Request) {
  try {
    const auth = requireUser(req);
    const { searchParams } = new URL(req.url);
    const result = await listOrders(auth.userIdNum, {
      symbol: searchParams.get("symbol") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      product: searchParams.get("product") ?? undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
      offset: searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/trade/spot/orders
// Places an order for the authenticated user. Validation, fees, balance checks
// and atomic execution live in the trading service.
export async function POST(req: Request) {
  try {
    const auth = requireUser(req);
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }
    const order = await placeOrder(auth.userIdNum, body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
