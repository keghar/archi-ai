import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize Prisma.");
  }

  return databaseUrl;
}

const databaseUrl = getDatabaseUrl();

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
  prismaConstructor?: typeof PrismaClient;
};

function createPrismaClient() {
  if (databaseUrl.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: databaseUrl });
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
}

const isDevelopment = process.env.NODE_ENV !== "production";
const cachedPrisma = isDevelopment ? globalForPrisma.prisma : undefined;

// Regenerating the client changes its constructor. A client cached before that
// change still validates queries against the old schema, even after hot reload.
export const prisma = cachedPrisma && globalForPrisma.prismaConstructor === PrismaClient
  ? cachedPrisma
  : createPrismaClient();

if (isDevelopment) {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaConstructor = PrismaClient;

  if (cachedPrisma && cachedPrisma !== prisma) {
    void cachedPrisma.$disconnect().catch(() => {
      console.error("Could not disconnect the previous development Prisma client.");
    });
  }
}
