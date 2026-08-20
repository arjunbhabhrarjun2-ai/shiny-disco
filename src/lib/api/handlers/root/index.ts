// Route table for the root catch-all (src/app/api/[...path]/route.ts) — all
// /api/* routes not covered by the auth/admin/market/trade/support catch-alls.
import type { ApiRouteTable } from "../../types";
import * as addFunds from "./addFunds";
import * as addFundsApprove from "./addFundsApprove";
import * as alerts from "./alerts";
import * as alertsCheck from "./alertsCheck";
import * as alertById from "./alertById";
import * as dashboard from "./dashboard";
import * as depositHistory from "./depositHistory";
import * as deposits from "./deposits";
import * as fx from "./fx";
import * as investmentPlans from "./investmentPlans";
import * as notifications from "./notifications";
import * as notificationsMarkRead from "./notificationsMarkRead";
import * as portfolio from "./portfolio";
import * as profitAccrue from "./profitAccrue";
import * as pushSubscribe from "./pushSubscribe";
import * as pushUnsubscribe from "./pushUnsubscribe";
import * as rewards from "./rewards";
import * as testAddReward from "./testAddReward";
import * as transaction from "./transaction";
import * as user from "./user";
import * as userReferral from "./userReferral";
import * as userReferralStats from "./userReferralStats";
import * as userSettings from "./userSettings";
import * as userSimple from "./userSimple";
import * as users from "./users";
import * as welcome from "./welcome";
import * as withdrawal from "./withdrawal";
import * as withdrawalApprove from "./withdrawalApprove";
import * as withdrawalCode from "./withdrawalCode";
import * as withdrawalHistory from "./withdrawalHistory";

export const routes: ApiRouteTable = [
  { pattern: "addFunds", handlers: { POST: addFunds.POST } },
  { pattern: "addFunds/approve", handlers: { GET: addFundsApprove.GET } },
  { pattern: "alerts", handlers: { GET: alerts.GET, POST: alerts.POST } },
  { pattern: "alerts/check", handlers: { GET: alertsCheck.GET } },
  { pattern: "alerts/:id", handlers: { DELETE: alertById.DELETE } },
  { pattern: "dashboard", handlers: { GET: dashboard.GET, POST: dashboard.POST } },
  { pattern: "depositHistory", handlers: { GET: depositHistory.GET } },
  { pattern: "deposits", handlers: { GET: deposits.GET } },
  { pattern: "fx", handlers: { GET: fx.GET } },
  { pattern: "investmentPlans", handlers: { POST: investmentPlans.POST } },
  { pattern: "notifications", handlers: { GET: notifications.GET } },
  { pattern: "notifications/mark-read", handlers: { POST: notificationsMarkRead.POST } },
  { pattern: "portfolio", handlers: { GET: portfolio.GET } },
  { pattern: "profit/accrue", handlers: { POST: profitAccrue.POST } },
  { pattern: "push/subscribe", handlers: { POST: pushSubscribe.POST } },
  { pattern: "push/unsubscribe", handlers: { POST: pushUnsubscribe.POST } },
  { pattern: "rewards", handlers: { GET: rewards.GET, POST: rewards.POST } },
  { pattern: "test/addReward", handlers: { POST: testAddReward.POST } },
  { pattern: "transaction", handlers: { GET: transaction.GET } },
  { pattern: "user", handlers: { GET: user.GET, POST: user.POST } },
  { pattern: "user/referral", handlers: { GET: userReferral.GET } },
  { pattern: "user/referral-stats", handlers: { GET: userReferralStats.GET } },
  { pattern: "user/settings", handlers: { POST: userSettings.POST } },
  { pattern: "user/simple", handlers: { GET: userSimple.GET } },
  { pattern: "users", handlers: { GET: users.GET } },
  { pattern: "welcome", handlers: { GET: welcome.GET } },
  { pattern: "withdrawal", handlers: { GET: withdrawal.GET, POST: withdrawal.POST } },
  { pattern: "withdrawal/approve", handlers: { GET: withdrawalApprove.GET } },
  { pattern: "withdrawal/code", handlers: { GET: withdrawalCode.GET, POST: withdrawalCode.POST } },
  { pattern: "withdrawalHistory", handlers: { GET: withdrawalHistory.GET } },
];
