// src/app/api/addFunds/route.ts

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

// ✅ Define the expected shape of the request body
interface AddFundsRequestBody {
  user: string;
  amount: number;
  currency: string;
  address?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { user, amount, currency, address } = body as AddFundsRequestBody;

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user || !emailRegex.test(user)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required." },
        { status: 400 }
      );
    }

    // ✅ Amount validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid positive amount is required." },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);

    if (!currency || !address) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // ✅ Find user
    const foundUser = await prisma.user.findUnique({
      where: { email: user },
      select: { id: true, email: true, firstName: true },
    });

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // ✅ Use UUID for transaction reference
    const transactionRef = uuidv4();

    // ✅ Create pending deposit and transaction atomically
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const deposit = await tx.deposit.create({
        data: {
          userId: foundUser.id,
          amount: numericAmount,
          currency: currency,
          address: address,
          status: "Pending",
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          userId: foundUser.id,
          amount: numericAmount,
          paymentMethod: currency,
          transactionRef: transactionRef,
          type: "Deposit",
          status: "Pending",
          description: `Deposit via ${currency}`,
        },
      });

      return { deposit, transaction };
    });

    // No email is sent. The pending deposit appears in the admin dashboard
    // (Approvals tab) where an authenticated admin approves or rejects it.
    return NextResponse.json(
      {
        success: true,
        message: "Deposit submitted successfully. Awaiting admin approval.",
        transactionRef: transactionRef,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ AddFunds error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process deposit." },
      { status: 500 }
    );
  }
}
