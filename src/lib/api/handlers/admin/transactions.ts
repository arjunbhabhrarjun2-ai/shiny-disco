import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";

// Platform-wide transaction audit feed (deposits, withdrawals, trades, swaps).
export async function GET(req: Request) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;     // Deposit | withdraw | trade | swap
    const status = searchParams.get("status") || undefined;
    const take = Math.min(Math.max(Number(searchParams.get("limit")) || 50, 1), 200);
    const skip = Math.max(Number(searchParams.get("offset")) || 0, 0);

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [rows, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        include: { user: { select: { id: true, email: true, username: true } } },
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({ success: true, transactions: rows, total });
  } catch (error) {
    return handleApiError(error);
  }
}
