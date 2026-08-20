import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";

// Admin activity / audit log.
export async function GET(req: Request) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const take = Math.min(Math.max(Number(searchParams.get("limit")) || 100, 1), 500);
    const logs = await prisma.adminLog.findMany({ orderBy: { createdAt: "desc" }, take });
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    return handleApiError(error);
  }
}
