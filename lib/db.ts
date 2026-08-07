// Database client singleton
// This prevents multiple Prisma Client instances in development

import { PrismaClient } from "../prisma/generated/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

// Add prisma to the global type
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!,
  })
  return new PrismaClient({ adapter })
}

// Use existing client or create new one
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// In development, save client to global to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
