import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { AuthService } from "@/lib/auth";
import { apiRateLimit } from "@/lib/apiRateLimit";
import { randomBytes } from "crypto";

interface SignInRequestBody {
  email: string;
  password: string;
  privateKey?: string;
}
// Explicitly type the parsed JSON body
export async function POST(req: Request) {
  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimit(req, "signin");
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const data: SignInRequestBody = await req.json();
    const { email, password, privateKey } = data;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Suspended accounts cannot sign in.
    if ((user as { status?: string }).status === "suspended") {
      return NextResponse.json(
        { error: "Your account has been suspended. Please contact support." },
        { status: 403 }
      );
    }

    // If private key is provided, verify it
    if (privateKey && user.privateKeyHash) {
      const isPrivateKeyValid = await bcrypt.compare(privateKey, user.privateKeyHash);
      if (!isPrivateKeyValid) {
        return NextResponse.json({ error: "Invalid private key" }, { status: 401 });
      }
    }

    // Fetch referral code
    let referral = await prisma.referral.findFirst({
      where: { userId: user.id },
      select: { code: true },
    });

    // If no referral exists, generate one
    if (!referral) {
      const referralCodeGenerated = randomBytes(4).toString('hex').toUpperCase();
      await prisma.referral.create({
        data: {
          userId: user.id,
          code: referralCodeGenerated,
        },
      });
      referral = { code: referralCodeGenerated };
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: (user as { role?: string }).role ?? "user",
    };
    const { accessToken } = AuthService.generateAccessTokenOnly(tokenPayload);

    // Return sanitized user data with token
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: (user as { role?: string }).role ?? "user",
        mainBalance: user.mainBalance,
        totalDeposit: user.totalDeposit,
        totalWithdraw: user.totalWithdrawals,
        referralCode: referral?.code,
      },
      accessToken,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
