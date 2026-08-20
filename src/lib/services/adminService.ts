// src/lib/services/adminService.ts
// Helper to record privileged admin actions into the AdminLog audit table.
import { prisma } from "@/lib/prisma";

export async function logAdmin(params: {
  adminId?: number;
  adminEmail: string;
  action: string;
  targetType?: string;
  targetId?: string | number;
  details?: string;
  ip?: string;
}): Promise<void> {
  try {
    await prisma.adminLog.create({
      data: {
        adminId: params.adminId ?? null,
        adminEmail: params.adminEmail,
        action: params.action,
        targetType: params.targetType ?? null,
        targetId: params.targetId != null ? String(params.targetId) : null,
        details: params.details ?? null,
        ip: params.ip ?? null,
      },
    });
  } catch {
    /* never let audit logging break the action */
  }
}
