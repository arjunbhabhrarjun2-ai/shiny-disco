// Route table for the /api/trade/* catch-all (src/app/api/trade/[...path]/route.ts).
import type { ApiRouteTable } from "../../types";
import * as spotOrders from "./spotOrders";
import * as spotOrdersMatch from "./spotOrdersMatch";
import * as spotOrderById from "./spotOrderById";
import * as spotHoldings from "./spotHoldings";
import * as otcQuote from "./otcQuote";
import * as otcAccept from "./otcAccept";
import * as swap from "./swap";

export const routes: ApiRouteTable = [
  { pattern: "spot/orders", handlers: { GET: spotOrders.GET, POST: spotOrders.POST } },
  { pattern: "spot/orders/match", handlers: { POST: spotOrdersMatch.POST } },
  { pattern: "spot/orders/:id", handlers: { PATCH: spotOrderById.PATCH, DELETE: spotOrderById.DELETE } },
  { pattern: "spot/holdings", handlers: { GET: spotHoldings.GET } },
  { pattern: "otc/quote", handlers: { POST: otcQuote.POST } },
  { pattern: "otc/accept", handlers: { POST: otcAccept.POST } },
  { pattern: "swap", handlers: { GET: swap.GET, POST: swap.POST } },
];
