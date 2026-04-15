import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  pgClient: ReturnType<typeof postgres> | undefined;
  drizzleDb: DrizzleDB | undefined;
};

function getDb(): DrizzleDB {
  if (globalForDb.drizzleDb) return globalForDb.drizzleDb;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client =
    globalForDb.pgClient ??
    postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });

  globalForDb.pgClient = client;
  globalForDb.drizzleDb = drizzle(client, { schema });
  return globalForDb.drizzleDb;
}

export const db = new Proxy({} as DrizzleDB, {
  get(_target, prop, receiver) {
    const realDb = getDb();
    const value = Reflect.get(realDb, prop, receiver);
    return typeof value === "function" ? value.bind(realDb) : value;
  },
});
