import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: any };

function getPrismaInstance() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  // Prevent loading better-sqlite3 during Vercel build/prerender phase
  if (process.env.VERCEL || process.env.NEXT_PHASE === 'phase-production-build') {
    try {
      globalForPrisma.prisma = new PrismaClient();
      return globalForPrisma.prisma;
    } catch (e) {
      console.warn("Prisma Client fallback initialization:", e);
    }
  }

  try {
    // Dynamic require to prevent top-level module evaluation failures on Vercel
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    
    const dbPath = path.join(process.cwd(), 'dev.db');
    const dbUrl = `file:${dbPath}`;
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    
    globalForPrisma.prisma = new PrismaClient({ adapter });
  } catch (e) {
    console.error("Failed to initialize Prisma with better-sqlite3, falling back to standard client:", e);
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
}

// Export a Proxy that behaves exactly like PrismaClient but initializes lazily
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const instance = getPrismaInstance();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
  set(target, prop, value, receiver) {
    const instance = getPrismaInstance();
    return Reflect.set(instance, prop, value, receiver);
  }
});
