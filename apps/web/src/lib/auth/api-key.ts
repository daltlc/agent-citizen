import { randomBytes, createHash } from "crypto";
import { db } from "@/lib/db";
import { apiKeys, citizens } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const API_KEY_PREFIX = "ck_";

export function generateApiKey(): string {
  return API_KEY_PREFIX + randomBytes(32).toString("hex");
}

// The raw key is only seen at creation time. The DB stores the SHA-256
// hash so a DB dump cannot yield working credentials.
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

function hintFor(key: string): string {
  return key.slice(-4);
}

export async function createApiKey(citizenId: string, name: string) {
  const key = generateApiKey();
  const [created] = await db
    .insert(apiKeys)
    .values({
      citizenId,
      keyHash: hashApiKey(key),
      keyHint: hintFor(key),
      name,
    })
    .returning({
      id: apiKeys.id,
      name: apiKeys.name,
      keyHint: apiKeys.keyHint,
      createdAt: apiKeys.createdAt,
    });
  return { ...created, key };
}

export async function deleteApiKey(keyId: string, citizenId: string) {
  const [deleted] = await db
    .delete(apiKeys)
    .where(and(eq(apiKeys.id, keyId), eq(apiKeys.citizenId, citizenId)))
    .returning();
  return deleted ?? null;
}

export async function getApiKeysByCitizenId(citizenId: string) {
  return db
    .select({
      id: apiKeys.id,
      name: apiKeys.name,
      keyHint: apiKeys.keyHint,
      lastUsedAt: apiKeys.lastUsedAt,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.citizenId, citizenId));
}

export async function getCitizenByApiKey(key: string) {
  if (!key.startsWith(API_KEY_PREFIX)) return null;

  const result = await db
    .select({
      keyId: apiKeys.id,
      citizen: {
        id: citizens.id,
        githubId: citizens.githubId,
        username: citizens.username,
        avatarUrl: citizens.avatarUrl,
        citizenScore: citizens.citizenScore,
        bio: citizens.bio,
        joinedAt: citizens.joinedAt,
      },
    })
    .from(apiKeys)
    .innerJoin(citizens, eq(apiKeys.citizenId, citizens.id))
    .where(eq(apiKeys.keyHash, hashApiKey(key)))
    .limit(1);

  if (result.length === 0) return null;

  db.update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, result[0].keyId))
    .then(() => {})
    .catch(() => {});

  return result[0].citizen;
}
