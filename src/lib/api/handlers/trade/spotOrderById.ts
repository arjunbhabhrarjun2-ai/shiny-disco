import type { ApiParams } from "@/lib/api/types";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";
import { cancelOrder, modifyOrder } from "@/lib/services/spotTradingService";

// PATCH /api/trade/spot/orders/:id — modify a resting (open) limit order's price
// and/or size via cancel-and-replace. Only the order's owner can modify it.
export async function PATCH(
  req: Request,
  params: ApiParams
) {
  try {
    const auth = requireUser(req);
    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const order = await modifyOrder(auth.userIdNum, id, {
      price: body?.price,
      size: body?.size,
    });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/trade/spot/orders/:id — cancel a resting (open) order and refund
// its reservation. Only the order's owner can cancel it.
export async function DELETE(
  req: Request,
  params: ApiParams
) {
  try {
    const auth = requireUser(req);
    const { id } = params;
    const order = await cancelOrder(auth.userIdNum, id);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return handleApiError(error);
  }
}
