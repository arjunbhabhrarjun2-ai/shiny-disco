import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authz";
import { AuthService } from "@/lib/auth";
import { handleApiError } from "@/lib/errorHandler";

// A 6-digit numeric withdrawal authorization code.
export function isValidWithdrawalCode(code: unknown): code is string {
  return typeof code === "string" && /^\d{6}$/.test(code);
}

// Read the user's withdrawal code hash via raw SQL so this works regardless of
// whether the generated Prisma client has been regenerated yet (the column is
// added by the accompanying migration).
export async function getWithdrawalCodeHash(userId: number): Promise<string | null> {
  const rows = await prisma.$queryRaw<{ withdrawalCodeHash: string | null }[]>`
    SELECT "withdrawalCodeHash" FROM "User" WHERE "id" = ${userId} LIMIT 1
  `;
  return rows[0]?.withdrawalCodeHash ?? null;
}

export async function setWithdrawalCodeHash(userId: number, hash: string): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "User" SET "withdrawalCodeHash" = ${hash} WHERE "id" = ${userId}
  `;
}

// GET — does the authenticated user already have a withdrawal code set?
export async function GET(req: Request) {
  try {
    const auth = requireUser(req);
    const hash = await getWithdrawalCodeHash(auth.userIdNum);
    return NextResponse.json({ success: true, hasCode: !!hash });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST — create the withdrawal code for the first time. Will not overwrite an
// existing code (prevents silent takeover); a reset must go through support.
export async function POST(req: Request) {
  try {
    const auth = requireUser(req);
    const { code } = await req.json();

    if (!isValidWithdrawalCode(code)) {
      return NextResponse.json(
        { success: false, message: "Withdrawal code must be exactly 6 digits." },
        { status: 400 },
      );
    }

    const existing = await getWithdrawalCodeHash(auth.userIdNum);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A withdrawal code is already set." },
        { status: 409 },
      );
    }

    const hash = await AuthService.hashPassword(code);
    await setWithdrawalCodeHash(auth.userIdNum, hash);

    return NextResponse.json({ success: true, message: "Withdrawal code created." });
  } catch (error) {
    return handleApiError(error);
  }
}
