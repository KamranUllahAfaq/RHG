import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: any };

// A robust dummy client that mocks Prisma methods to prevent build/runtime crashes during static page generation
const dummyPrisma = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then' || prop === '$$typeof' || prop === 'constructor' || prop === 'toJSON') {
      return undefined;
    }
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

  // Prevent loading Prisma Client if DATABASE_URL is missing or during Next.js build phase
  const hasDbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL !== "" && !process.env.DATABASE_URL.includes("username:password");
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.VERCEL === '1';

  if (isBuildPhase || !hasDbUrl) {
    return dummyPrisma;
  }

  try {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (e) {
    console.error("Failed to initialize Prisma Client, falling back to dummy client:", e);
    return dummyPrisma;
  }

  return globalForPrisma.prisma;
}

// Export a Proxy that behaves exactly like PrismaClient but initializes lazily
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
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
