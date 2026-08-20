// src/lib/prisma.ts
// Singleton PrismaClient. Without the globalThis guard, Next.js HMR (dev) and
// serverless cold paths create a new client per module reload, exhausting the
// database connection pool. See: https://pris.ly/d/help/next-js-best-practices
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
