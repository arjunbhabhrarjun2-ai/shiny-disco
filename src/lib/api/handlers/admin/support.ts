import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";

// All support tickets across users, with last message + counts (admin inbox).
export async function GET(req: Request) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    const tickets = await prisma.ticket.findMany({
      where: status ? { status } : {},
      orderBy: { updatedAt: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, email: true, username: true } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    const SUPPORT = "[[support]]";
    const data = tickets.map((t) => {
      // A message is from the user unless it's tagged as support or was sent by
      // a different (admin) account. The [[support]] tag is stripped on the way out.
      const decode = (m: { content: string; senderId: number }) => {
        const tagged = m.content.startsWith(SUPPORT);
        return {
          fromUser: !tagged && m.senderId === t.userId,
          content: tagged ? m.content.slice(SUPPORT.length) : m.content,
        };
      };
      const last = t.messages[t.messages.length - 1];
      const lastDec = last ? decode(last) : null;
      return {
        id: t.id,
        subject: t.subject,
        status: t.status,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        user: t.user,
        messageCount: t.messages.length,
        lastMessage: last && lastDec
          ? { content: lastDec.content, fromUser: lastDec.fromUser, createdAt: last.createdAt }
          : null,
        messages: t.messages.map((m) => {
          const d = decode(m);
          return { id: m.id, content: d.content, fromUser: d.fromUser, createdAt: m.createdAt };
        }),
      };
    });

    return NextResponse.json({ success: true, tickets: data });
  } catch (error) {
    return handleApiError(error);
  }
}
