import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: any };

// A robust dummy client that mocks Prisma methods to prevent build/runtime crashes when database is unavailable
const dummyPrisma = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    // Return a nested proxy to handle chaining (e.g. prisma.student.findMany)
    return new Proxy(() => {}, {
      get(t, p) {
        if (p === 'then') return undefined;
        return () => Promise.resolve([]);
      },
      apply() {
        return Promise.resolve([]);
      }
    });
  }
});

function getPrismaInstance() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  // Prevent loading better-sqlite3 on Vercel (both build and runtime)
  if (process.env.VERCEL === '1' || process.env.NEXT_PHASE === 'phase-production-build') {
    return dummyPrisma;
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
    console.error("Failed to initialize Prisma with better-sqlite3, falling back to dummy client:", e);
    // Fall back to dummy client to avoid crashing the build/server when native bindings fail
    return dummyPrisma;
  }

  return globalForPrisma.prisma;
}

// Export a Proxy that behaves exactly like PrismaClient but initializes lazily
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    // Avoid triggering instantiation for standard check properties if accessed before initialization
    if (prop === '$$typeof' || prop === 'then' || prop === 'constructor' || prop === 'toJSON') {
      return undefined;
    }
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
