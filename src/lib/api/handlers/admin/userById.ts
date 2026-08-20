import type { ApiParams } from "@/lib/api/types";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { handleApiError, AppError } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { logAdmin } from "@/lib/services/adminService";

// GET one user (full detail)
export async function GET(req: Request, params: ApiParams) {
  try {
    requireAdmin(req);
    const { id } = params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        holdings: { where: { amount: { gt: 0 } } },
        deposits: { orderBy: { createdAt: "desc" }, take: 10 },
        withdrawals: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH update user: status (suspend/activate), profile fields, balances.
export async function PATCH(req: Request, params: ApiParams) {
  try {
    const admin = requireAdmin(req);
    const { id } = params;
    const userId = Number(id);
    const body = await req.json().catch(() => ({}));

    const data: Record<string, unknown> = {};
    const changed: string[] = [];

    if (typeof body.status === "string" && ["active", "suspended"].includes(body.status)) {
      data.status = body.status; changed.push(`status=${body.status}`);
    }
    if (typeof body.role === "string" && ["user", "admin"].includes(body.role)) {
      data.role = body.role; changed.push(`role=${body.role}`);
    }
    for (const f of ["firstName", "lastName", "username", "email", "phone"] as const) {
      if (typeof body[f] === "string" && body[f].length <= 120) { data[f] = body[f]; changed.push(f); }
    }
    for (const f of ["mainBalance", "interestBalance", "investmentBalance"] as const) {
      if (body[f] !== undefined && Number.isFinite(Number(body[f]))) {
        data[f] = Number(body[f]); changed.push(`${f}=${body[f]}`);
      }
    }
    if (Object.keys(data).length === 0) {
      throw new AppError("No valid fields to update", 400, "BAD_REQUEST");
    }

    // Don't let an admin suspend or demote themselves accidentally.
    if (userId === admin.userIdNum && (data.status === "suspended" || data.role === "user")) {
      throw new AppError("You cannot suspend or demote your own account", 400, "SELF_ACTION");
    }

    const updated = await prisma.user.update({ where: { id: userId }, data });
    await logAdmin({
      adminId: admin.userIdNum, adminEmail: admin.email,
      action: "edit_user", targetType: "user", targetId: userId,
      details: changed.join(", "),
      ip: req.headers.get("x-forwarded-for") || undefined,
    });

    return NextResponse.json({ success: true, user: { id: updated.id, status: updated.status, role: updated.role } });
  } catch (error) {
    return handleApiError(error);
  }
}
