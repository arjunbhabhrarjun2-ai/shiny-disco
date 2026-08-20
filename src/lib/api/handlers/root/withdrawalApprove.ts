import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/services/notificationService";
import { verifyApprovalToken, type ApprovalAction } from "@/lib/approvalToken";
import { getAuthUser } from "@/lib/authz";
import { logSecurityEvent } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const withdrawalId = url.searchParams.get("withdrawalId");
    const action = url.searchParams.get("action");
    const token = url.searchParams.get("token");

    if (!withdrawalId || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters: withdrawalId and action" },
        { status: 400 }
      );
    }

    const id = parseInt(withdrawalId);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid withdrawal ID" },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { success: false, message: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }
    const newStatus = action === "approve" ? "Completed" : "Rejected";

    // Accept either a valid signed approval token or an authenticated admin Bearer session.
    const tokenResult = verifyApprovalToken(token, {
      resource: "withdrawal",
      id,
      action: action as ApprovalAction,
    });
    const adminSession = getAuthUser(req);
    if (!tokenResult.valid && !adminSession?.isAdmin) {
      logSecurityEvent("withdrawal_approval_unauthorized", {
        withdrawalId: id,
        action,
        tokenReason: tokenResult.reason,
      });
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { success: false, message: "Withdrawal not found." },
        { status: 404 }
      );
    }

    if (withdrawal.status !== "Pending") {
      return NextResponse.json(
        { success: false, message: "Withdrawal is not pending." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (newStatus === "Completed") {
        // Atomic, guarded decrement of the correct asset. USDT → mainBalance;
        // any other asset → the user's Holding. Prevents TOCTOU overdraw.
        const asset = String(withdrawal.currency || "USDT").toUpperCase();
        if (asset === "USDT") {
          const updated = await tx.user.updateMany({
            where: { id: withdrawal.userId, mainBalance: { gte: withdrawal.amount } },
            data: {
              mainBalance: { decrement: withdrawal.amount },
              totalWithdrawals: { increment: withdrawal.amount },
            },
          });
          if (updated.count !== 1) throw new Error("INSUFFICIENT_BALANCE");
        } else {
          const updated = await tx.holding.updateMany({
            where: { userId: withdrawal.userId, asset, amount: { gte: withdrawal.amount } },
            data: { amount: { decrement: withdrawal.amount } },
          });
          if (updated.count !== 1) throw new Error("INSUFFICIENT_BALANCE");
        }
      }

      await tx.withdrawal.update({
        where: { id },
        data: { status: newStatus },
      });

      await tx.transaction.updateMany({
        where: { userId: withdrawal.userId, type: "withdraw", status: "Pending" },
        data: { status: newStatus === "Completed" ? "Success" : "Failed" },
      });
    });

    // Send notification after successful processing
    try {
      if (newStatus === "Completed") {
        await NotificationService.notifyWithdrawalApproved(withdrawal.userId, withdrawal.amount);
      } else {
        await NotificationService.notifyWithdrawalRejected(withdrawal.userId, withdrawal.amount);
      }
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
      // Don't fail the entire operation if notification fails
    }

    // No admin email — approval/rejection is performed and shown in the
    // admin dashboard; the user is informed via in-app notification above.
    return NextResponse.json(
      { success: true, message: `Withdrawal ${newStatus.toLowerCase()}` },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_BALANCE") {
      return NextResponse.json(
        { success: false, message: "User has insufficient balance for this withdrawal." },
        { status: 400 }
      );
    }
    console.error("Withdrawal approval error:", error);
    return NextResponse.json(
      { success: false, message: "Withdrawal approval failed" },
      { status: 500 }
    );
  }
}
