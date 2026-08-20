import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";
import { matchRestingOrders } from "@/lib/services/spotTradingService";

// POST /api/trade/spot/orders/match
// Fills resting limit orders that have become marketable. Intended for a cron /
// scheduled task. Protected by either an admin session or a shared CRON_SECRET
// passed as `Authorization: Bearer <CRON_SECRET>` or `?secret=`.
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const provided =
      url.searchParams.get("secret") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const cronSecret = process.env.CRON_SECRET;

    const isCron = !!cronSecret && provided === cronSecret;
    const admin = getAuthUser(req);

    if (!isCron && !admin?.isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const filled = await matchRestingOrders();
    return NextResponse.json({ success: true, filled });
  } catch (error) {
    return handleApiError(error);
  }
}
