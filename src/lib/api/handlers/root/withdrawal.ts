import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { requireUser } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";

type WithdrawalRequest = {
  amount: number;
  currency: string;
  address: string;
};

// GET — list withdrawals. Non-admins only ever see their own; admins may pass
// ?userId= to view a specific user's. userId is NEVER trusted from the client
// for a non-admin (was an IDOR allowing anyone to read others' withdrawals).
export async function GET(req: Request) {
  try {
    const auth = requireUser(req);
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    const where = auth.isAdmin
      ? requestedUserId
        ? { userId: Number(requestedUserId), status: { not: "Pending" } }
        : {}
      : { userId: auth.userIdNum, status: { not: "Pending" } };

    const withdrawals = await prisma.withdrawal.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: withdrawals });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST — create a withdrawal for the AUTHENTICATED user only.
export async function POST(req: Request) {
  try {
    const auth = requireUser(req);
    const { amount, currency, address }: WithdrawalRequest = await req.json();

    if (!amount || !currency || !address) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Identity comes from the verified token, NOT from the request body.
    const userId = auth.userIdNum;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );

    // Asset-aware validation: users can only withdraw an asset they actually
    // hold. USDT maps to mainBalance; every other asset maps to a Holding.
    const asset = String(currency).toUpperCase();
    if (asset === "USDT") {
      if (user.mainBalance < amount) {
        return NextResponse.json(
          { success: false, message: "Insufficient USDT balance" },
          { status: 400 }
        );
      }
    } else {
      const holding = await prisma.holding.findUnique({
        where: { userId_asset: { userId, asset } },
      });
      if (!holding || holding.amount < amount) {
        return NextResponse.json(
          {
            success: false,
            message: `You don't hold enough ${asset} to withdraw. Available: ${holding?.amount ?? 0}`,
          },
          { status: 400 }
        );
      }
    }

    // Use UUID for transaction reference
    const transactionRef = uuidv4();

    const withdrawal = await prisma.withdrawal.create({
      data: { userId, amount, currency, address, status: "Pending" },
    });

    // Do NOT deduct balance here - wait for admin approval
    // Only increment totalWithdrawals on approval

    await prisma.transaction.create({
      data: {
        userId,
        type: "withdraw",
        amount,
        description: `Withdrawal request of ${amount} ${currency}`,
        status: "Pending",
        transactionRef: transactionRef,
      },
    });

    // No email is sent. The pending withdrawal appears in the admin dashboard
    // (Approvals tab) where an authenticated admin approves or rejects it.
    return NextResponse.json({
      success: true,
      message: "Withdrawal submitted successfully and pending admin approval.",
      transactionRef: transactionRef,
      data: withdrawal
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
