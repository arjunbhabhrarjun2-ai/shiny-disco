import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    requireAdmin(req);
    const now = Date.now();
    const weekAgo = new Date(now - 7 * 24 * 3600 * 1000);
    const since = new Date(now - 13 * 24 * 3600 * 1000);
    since.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      suspendedUsers,
      newUsers7d,
      depCompleted,
      wdCompleted,
      balSum,
      investedAgg,
      activeInvestments,
      volAgg,
      feeAgg,
      pendingDeposits,
      pendingWithdrawals,
      pendingTransactions,
      openTickets,
      usersRows,
      depositRows,
      withdrawalRows,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "suspended" } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      // Totals from the actual ledgers, not stale user.* fields.
      prisma.deposit.aggregate({ _sum: { amount: true }, where: { status: { in: ["Completed", "Approved", "Success"] } } }),
      prisma.withdrawal.aggregate({ _sum: { amount: true }, where: { status: { in: ["Completed", "Approved", "Success"] } } }),
      prisma.user.aggregate({ _sum: { mainBalance: true } }),
      prisma.investment.aggregate({ _sum: { amount: true }, where: { status: "Active" } }),
      prisma.investment.count({ where: { status: "Active" } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: { in: ["trade", "swap"] } } }),
      prisma.spotOrder.aggregate({ _sum: { fee: true }, where: { status: "filled" } }),
      prisma.deposit.count({ where: { status: "Pending" } }),
      prisma.withdrawal.count({ where: { status: "Pending" } }),
      prisma.transaction.count({ where: { status: "Pending" } }),
      prisma.ticket.count({ where: { status: { notIn: ["closed", "resolved"] } } }),
      prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.deposit.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, amount: true } }),
      prisma.withdrawal.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, amount: true } }),
    ]);

    const dayKey = (d: Date | string) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x.getTime();
    };
    const days: Date[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    const series = days.map((d) => {
      const k = d.getTime();
      return {
        day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        signups: usersRows.filter((u) => dayKey(u.createdAt) === k).length,
        deposits: depositRows.filter((x) => dayKey(x.createdAt) === k).reduce((s, x) => s + (x.amount || 0), 0),
        withdrawals: withdrawalRows.filter((x) => dayKey(x.createdAt) === k).reduce((s, x) => s + (x.amount || 0), 0),
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers: totalUsers - suspendedUsers,
        suspendedUsers,
        newUsers7d,
        totalDeposited: depCompleted._sum.amount ?? 0,
        totalWithdrawn: wdCompleted._sum.amount ?? 0,
        totalBalance: balSum._sum.mainBalance ?? 0,
        totalInvested: investedAgg._sum.amount ?? 0,
        activeInvestments,
        tradingVolume: volAgg._sum.amount ?? 0,
        revenue: feeAgg._sum.fee ?? 0,
        pendingDeposits,
        pendingWithdrawals,
        pendingTransactions,
        openTickets,
      },
      series,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
