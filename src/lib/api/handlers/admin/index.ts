// Route table for the /api/admin/* catch-all (src/app/api/admin/[...path]/route.ts).
import type { ApiRouteTable } from "../../types";
import * as pending from "./pending";
import * as audit from "./audit";
import * as transactions from "./transactions";
import * as users from "./users";
import * as userById from "./userById";
import * as support from "./support";
import * as supportReply from "./supportReply";
import * as stats from "./stats";
import * as verify from "./verify";
import * as auth from "./auth";

export const routes: ApiRouteTable = [
  { pattern: "pending", handlers: { GET: pending.GET } },
  { pattern: "audit", handlers: { GET: audit.GET } },
  { pattern: "transactions", handlers: { GET: transactions.GET } },
  { pattern: "users", handlers: { GET: users.GET } },
  { pattern: "users/:id", handlers: { GET: userById.GET, PATCH: userById.PATCH } },
  { pattern: "support", handlers: { GET: support.GET } },
  { pattern: "support/:id/reply", handlers: { POST: supportReply.POST } },
  { pattern: "stats", handlers: { GET: stats.GET } },
  { pattern: "verify", handlers: { GET: verify.GET } },
  { pattern: "auth", handlers: { POST: auth.POST } },
];
