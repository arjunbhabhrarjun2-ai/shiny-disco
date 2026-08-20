import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RewardService } from "@/lib/services/rewardService";
import { NotificationService } from "@/lib/services/notificationService";
import { verifyApprovalToken, type ApprovalAction } from "@/lib/approvalToken";
import { getAuthUser } from "@/lib/authz";
import { logSecurityEvent } from "@/lib/logger";

// GET /api/addFunds/approve?transactionId=...&action=approve|reject
// Also supports depositId parameter for direct deposit approval
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const transactionId = url.searchParams.get("transactionId");
    const depositId = url.searchParams.get("depositId");
    const action = url.searchParams.get("action");
    const token = url.searchParams.get("token");

    if ((!transactionId && !depositId) || !action) {
      return NextResponse.json(
        { success: false, message: "Missing transactionId/depositId or action." },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { success: false, message: "Invalid action." },
        { status: 400 }
      );
    }

    const adminSession = getAuthUser(req);

    // Resolve the pending Deposit transaction. The admin dashboard sends
    // depositId; legacy signed email links sent transactionId.
    let resolvedTx:
      | Prisma.TransactionGetPayload<{ include: { user: true } }>
      | null = null;

    if (transactionId) {
      const id = parseInt(transactionId);
      if (isNaN(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid transaction ID" },
          { status: 400 }
        );
      }
      // Accept a valid signed token OR an authenticated admin.
      const tokenResult = verifyApprovalToken(token, {
        resource: "deposit",
        id,
        action: action as ApprovalAction,
      });
      if (!tokenResult.valid && !adminSession?.isAdmin) {
        logSecurityEvent("deposit_approval_unauthorized", { id, action, tokenReason: tokenResult.reason });
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
      resolvedTx = await prisma.transaction.findUnique({
        where: { id },
        include: { user: true },
      });
    } else {
      // depositId path — admin session required (no signed token).
      if (!adminSession?.isAdmin) {
        logSecurityEvent("deposit_approval_unauthorized", { depositId, action });
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
      const did = parseInt(String(depositId));
      if (isNaN(did)) {
        return NextResponse.json(
          { success: false, message: "Invalid deposit ID" },
          { status: 400 }
        );
      }
      const deposit = await prisma.deposit.findUnique({ where: { id: did } });
      if (!deposit) {
        return NextResponse.json({ success: false, message: "Deposit not found." }, { status: 404 });
      }
      resolvedTx = await prisma.transaction.findFirst({
        where: { userId: deposit.userId, type: "Deposit", amount: deposit.amount, status: "Pending" },
        orderBy: { createdAt: "desc" },
        include: { user: true },
      });
    }

    if (!resolvedTx) {
      return NextResponse.json(
        { success: false, message: "Transaction not found." },
        { status: 404 }
      );
    }
    // Non-null from here; capturing as const preserves narrowing inside closures.
    const transaction = resolvedTx;

    if (transaction.status !== "Pending") {
      return NextResponse.json(
        { success: false, message: "Transaction already processed." },
        { status: 400 }
      );
    }

    if (transaction.type !== "Deposit") {
      return NextResponse.json(
        { success: false, message: "Only deposits can be approved." },
        { status: 400 }
      );
    }

    // Determine new statuses
    const newTransactionStatus = action === "approve" ? "Success" : "Failed";
    const newDepositStatus = action === "approve" ? "Completed" : "Failed";

    // Atomic update: transaction, deposit, user balance, rewards
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update transaction status
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: newTransactionStatus },
      });

      // Find and update deposit status
      const deposit = await tx.deposit.findFirst({
        where: {
          userId: transaction.userId,
          amount: transaction.amount,
          status: "Pending",
          createdAt: {
            gte: new Date(transaction.createdAt.getTime() - 1000), // Small tolerance
            lte: new Date(transaction.createdAt.getTime() + 1000),
          },
        },
      });

      if (deposit) {
        await tx.deposit.update({
          where: { id: deposit.id },
          data: { status: newDepositStatus },
        });
      }

      // Update user balance only on approval
      if (action === "approve") {
        await tx.user.update({
          where: { id: transaction.userId },
          data: {
            mainBalance: { increment: transaction.amount },
            totalDeposit: { increment: transaction.amount },
          },
        });

        // Auto-redeem pending referral rewards for this user
        const pendingRewards = await (tx as any).referralReward.findMany({
          where: { 
            referredUserId: transaction.userId, 
            status: 'PENDING' 
          },
        });

        if (pendingRewards.length > 0) {
          // Update all pending rewards to REDEEMED
          await (tx as any).referralReward.updateMany({
            where: { 
              referredUserId: transaction.userId, 
              status: 'PENDING' 
            },
            data: { 
              status: 'REDEEMED',
              redeemedAt: new Date()
            },
          });

          // Credit each referrer's balance
          for (const reward of pendingRewards) {
            await tx.user.update({
              where: { id: reward.userId },
              data: { 
                mainBalance: { increment: reward.amount },
                totalEarn: { increment: reward.amount }
              },
            });

            // Create transaction record for referral earnings
            await tx.transaction.create({
              data: {
                userId: reward.userId,
                type: "Referral Reward",
                amount: reward.amount,
                description: `Referral reward for user ${transaction.userId}'s deposit of $${transaction.amount}`,
                status: "Success",
              },
            });
          }
        }

      }
    }, {
      maxWait: 10000, // 10 seconds
      timeout: 10000, // 10 seconds
    });

    // Award referral reward using RewardService AFTER transaction (for backward compatibility)
    if (action === "approve") {
      const deposit = await prisma.deposit.findFirst({
        where: {
          userId: transaction.userId,
          amount: transaction.amount,
          status: "Completed",
          createdAt: {
            gte: new Date(transaction.createdAt.getTime() - 1000),
            lte: new Date(transaction.createdAt.getTime() + 1000),
          },
        },
      });
      
      if (deposit) {
        try {
          await RewardService.awardReferralReward(transaction.userId, transaction.amount, "Deposit", deposit.id);
        } catch (rewardError) {
          console.error("Failed to award reward points:", rewardError);
          // Don't fail the entire operation if reward points fail
        }
      }
    }

    // Send notification after successful processing
    try {
      if (action === "approve") {
        await NotificationService.notifyDepositApproved(transaction.userId, transaction.amount);
      } else {
        await NotificationService.notifyDepositRejected(transaction.userId, transaction.amount);
      }
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
      // Don't fail the entire operation if notification fails
    }

    return NextResponse.json(
      {
        success: true,
        message: `Deposit ${action === "approve" ? "approved" : "rejected"} successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process approval." },
      { status: 500 }
    );
  }
}
