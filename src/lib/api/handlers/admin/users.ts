import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const take = Math.min(Math.max(Number(searchParams.get("limit")) || 50, 1), 200);
    const skip = Math.max(Number(searchParams.get("offset")) || 0, 0);

    const where = q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" as const } },
            { username: { contains: q, mode: "insensitive" as const } },
            { firstName: { contains: q, mode: "insensitive" as const } },
            { lastName: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        select: {
          id: true, firstName: true, lastName: true, username: true, email: true,
          phone: true, role: true, status: true, mainBalance: true,
          investmentBalance: true, interestBalance: true, totalDeposit: true,
          totalWithdrawals: true, totalEarn: true, totalReferrals: true, createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ success: true, users, total });
  } catch (error) {
    return handleApiError(error);
  }
}
