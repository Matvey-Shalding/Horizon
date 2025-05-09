import { PrismaClient } from '@prisma/client'

//Evade errors with Next.js hot reload

declare global {
  var prisma: PrismaClient | undefined
}

export const Database = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = Database
}