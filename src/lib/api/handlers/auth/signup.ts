// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { NotificationService } from "@/lib/services/notificationService";

interface SignupRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phone?: string;
  referralCode?: string;
  termsAccepted: boolean;
  termsAcceptedIP?: string;
}

export async function POST(req: Request) {
  try {
    const data: SignupRequestBody = await req.json();
    const { firstName, lastName, email, username, password, phone, referralCode, termsAccepted, termsAcceptedIP } = data;

    if (!firstName || !lastName || !email || !username || !password || !termsAccepted) {
      return NextResponse.json({ error: "All required fields must be filled and terms must be accepted" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    let referredById: number | null = null;
    if (referralCode) {
      const referrer = await prisma.referral.findUnique({
        where: { code: referralCode },
        include: { user: true },
      });

      if (referrer) {
        // Check if user is trying to refer themselves
        const existingUserWithEmail = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (existingUserWithEmail && existingUserWithEmail.id === referrer.userId) {
          return NextResponse.json({ error: "You cannot use your own referral code" }, { status: 400 });
        }

        referredById = referrer.userId;
      }
    }

    const BCRYPT_ROUNDS = 12; // unified with AuthService
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const privateKey = randomBytes(32).toString("hex");
    const privateKeyHash = await bcrypt.hash(privateKey, BCRYPT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        mainBalance: 0,
        investmentBalance: 0,
        totalEarn: 0,
        totalDeposit: 0,
        roi: 0,
        redeemedRoi: 0,
        speedInvest: 0,
        completed: 0,
        referredById,
        privateKeyHash,
        termsAcceptedAt: new Date(),
        termsAcceptedIP: termsAcceptedIP || req.headers.get("x-forwarded-for") || "unknown",
      },
    });

    // Create a referral code for the new user immediately
    const referralCodeGenerated = randomBytes(4).toString("hex").toUpperCase();
    await prisma.referral.create({
      data: {
        userId: newUser.id,
        code: referralCodeGenerated,
      },
    });

    // If user was referred, increment referrer's totalReferrals and create pending reward
    if (referredById) {
      const REFERRAL_AMOUNT = 150.0; // $150 per referral

      await prisma.$transaction(async (tx) => {
        // Increment total referrals
        await tx.user.update({
          where: { id: referredById },
          data: {
            totalReferrals: { increment: 1 },
          },
        });

        // Add a pending referral reward
        await tx.referralReward.create({
          data: {
            userId: referredById,
            referredUserId: newUser.id,
            amount: REFERRAL_AMOUNT,
            status: 'PENDING',
          },
        });
      });
    }

    // Create admin notification in database
    try {
      await NotificationService.notifyAdminNewSignup(firstName, lastName, username, email, phone);
    } catch (notificationError) {
      console.error("❌ Failed to create admin notification:", notificationError);
      // Don't fail signup if notification fails
    }

    // Return user summary + referral code + raw privateKey (one-time)
    return NextResponse.json({
      message: "Signup successful",
      privateKey,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        mainBalance: newUser.mainBalance,
        totalDeposit: newUser.totalDeposit,
        referralCode: referralCodeGenerated,
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
