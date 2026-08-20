import type { ApiParams } from "@/lib/api/types";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { handleApiError, AppError } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { logAdmin } from "@/lib/services/adminService";

// Admin reply to a ticket; optionally set status (open|pending|resolved|closed).
export async function POST(req: Request, params: ApiParams) {
  try {
    const admin = requireAdmin(req);
    const { id } = params;
    const ticketId = Number(id);
    const body = await req.json().catch(() => ({}));
    const content = String(body?.content || "").trim();
    if (!content) throw new AppError("Message content required", 400, "BAD_REQUEST");

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new AppError("Ticket not found", 404, "NOT_FOUND");

    const newStatus =
      typeof body?.status === "string" && ["open", "pending", "resolved", "closed"].includes(body.status)
        ? body.status
        : "pending";

    // Tag the stored content so this message is always identified as a
    // support/admin reply (renders on the correct side) even when the admin
    // and the ticket owner happen to be the same account.
    const [message] = await prisma.$transaction([
      prisma.message.create({ data: { ticketId, senderId: admin.userIdNum, content: `[[support]]${content}` } }),
      prisma.ticket.update({ where: { id: ticketId }, data: { status: newStatus } }),
    ]);

    await logAdmin({
      adminId: admin.userIdNum, adminEmail: admin.email,
      action: "support_reply", targetType: "ticket", targetId: ticketId,
      details: `status=${newStatus}`,
    });

    return NextResponse.json({ success: true, message: { id: message.id, content }, status: newStatus });
  } catch (error) {
    return handleApiError(error);
  }
}
