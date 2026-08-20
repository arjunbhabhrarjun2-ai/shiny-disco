import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authz";
import { AuthService } from "@/lib/auth";
import { handleApiError, AppError } from "@/lib/errorHandler";
import { randomBytes } from "crypto";

// Self-service account settings for the authenticated user:
//   action: "email"       — change email (currentPassword + email)
//   action: "password"    — change password (currentPassword + newPassword)
//   action: "privateKey"  — reset private key (currentPassword) → returns new key once
export async function POST(req: Request) {
  try {
    const auth = requireUser(req);
    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "");

    const user = await prisma.user.findUnique({ where: { id: auth.userIdNum } });
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    // Verify the account password for sensitive changes. Accounts that have no
    // password set (e.g. created via upsert) skip this check.
    const verifyCurrent = async () => {
      if (!user.password) return;
      const ok = await AuthService.verifyPassword(String(body?.currentPassword || ""), user.password);
      if (!ok) throw new AppError("Current password is incorrect.", 401, "BAD_PASSWORD");
    };

    if (action === "email") {
      const newEmail = String(body?.email || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        throw new AppError("Enter a valid email address.", 400, "BAD_EMAIL");
      }
      await verifyCurrent();
      const existing = await prisma.user.findUnique({ where: { email: newEmail } });
      if (existing && existing.id !== user.id) {
        throw new AppError("That email is already in use.", 409, "EMAIL_TAKEN");
      }
      await prisma.user.update({ where: { id: user.id }, data: { email: newEmail } });
      return NextResponse.json({ success: true, message: "Email updated.", email: newEmail });
    }

    if (action === "password") {
      const newPassword = String(body?.newPassword || "");
      if (newPassword.length < 8) {
        throw new AppError("New password must be at least 8 characters.", 400, "WEAK_PASSWORD");
      }
      await verifyCurrent();
      const hash = await AuthService.hashPassword(newPassword);
      await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
      return NextResponse.json({ success: true, message: "Password updated." });
    }

    if (action === "privateKey") {
      await verifyCurrent();
      // Generate a fresh private key, store only its hash, return it once.
      const key = randomBytes(24).toString("hex");
      const hash = await AuthService.hashPassword(key);
      await prisma.user.update({ where: { id: user.id }, data: { privateKeyHash: hash } });
      return NextResponse.json({
        success: true,
        message: "Private key reset. Save it now — it won't be shown again.",
        privateKey: key,
      });
    }

    if (action === "deleteAccount") {
      await verifyCurrent();
      const id = user.id;
      // Remove all rows that reference the user, then the user itself, in one
      // FK-safe transaction. Other users referred by this user are detached.
      await prisma.$transaction([
        prisma.message.deleteMany({ where: { OR: [{ senderId: id }, { ticket: { userId: id } }] } }),
        prisma.ticket.deleteMany({ where: { userId: id } }),
        prisma.referralReward.deleteMany({ where: { OR: [{ userId: id }, { referredUserId: id }] } }),
        prisma.referral.deleteMany({ where: { userId: id } }),
        prisma.rewardLedger.deleteMany({ where: { userId: id } }),
        prisma.notification.deleteMany({ where: { userId: id } }),
        prisma.priceAlert.deleteMany({ where: { userId: id } }),
        prisma.deposit.deleteMany({ where: { userId: id } }),
        prisma.investment.deleteMany({ where: { userId: id } }),
        prisma.transaction.deleteMany({ where: { userId: id } }),
        prisma.withdrawal.deleteMany({ where: { userId: id } }),
        prisma.spotOrder.deleteMany({ where: { userId: id } }),
        prisma.holding.deleteMany({ where: { userId: id } }),
        prisma.user.updateMany({ where: { referredById: id }, data: { referredById: null } }),
        prisma.user.delete({ where: { id } }),
      ]);
      return NextResponse.json({ success: true, message: "Account deleted." });
    }

    throw new AppError("Unknown settings action.", 400, "BAD_ACTION");
  } catch (error) {
    return handleApiError(error);
  }
}
