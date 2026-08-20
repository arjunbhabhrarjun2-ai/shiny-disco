import type { ApiParams } from "@/lib/api/types";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function PATCH(request: NextRequest, params: ApiParams) {
  try {
    const { id } = params;
    const ticketId = parseInt(id);
    if (isNaN(ticketId)) {
      return NextResponse.json(
        { error: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    // Check if ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Update ticket status to closed
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: "closed",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: updatedTicket.id,
        status: updatedTicket.status,
        updatedAt: updatedTicket.updatedAt,
      },
      message: "Ticket closed successfully",
    });
  } catch (error) {
    console.error("Error closing ticket:", error);
    return NextResponse.json(
      { error: "Failed to close ticket" },
      { status: 500 }
    );
  }
}
