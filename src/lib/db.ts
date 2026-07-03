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

  // Prevent loading Prisma Client during Next.js build phase on Vercel
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.VERCEL === '1';

  if (isBuildPhase) {
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
    // Do not use Reflect.get with receiver if instance is dummyPrisma to avoid bind and target matching issues
    const value = instance === dummyPrisma ? (instance as any)[prop] : Reflect.get(instance, prop, receiver);
    if (typeof value === 'function' && instance !== dummyPrisma) {
      return value.bind(instance);
    }
    return value;
  },
  set(target, prop, value, receiver) {
    const instance = getPrismaInstance();
    if (instance === dummyPrisma) {
      (instance as any)[prop] = value;
      return true;
    }
    return Reflect.set(instance, prop, value, receiver);
  }
});
