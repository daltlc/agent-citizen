import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { apiKeys, citizens } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const API_KEY_PREFIX = "ck_";

export function generateApiKey(): string {
  return API_KEY_PREFIX + randomBytes(32).toString("hex");
}

export async function createApiKey(citizenId: string, name: string) {
  const key = generateApiKey();
  const [created] = await db
    .insert(apiKeys)
    .values({ citizenId, key, name })
    .returning();
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
  const keys = await db
    .select({
      id: apiKeys.id,
      name: apiKeys.name,
      lastUsedAt: apiKeys.lastUsedAt,
      createdAt: apiKeys.createdAt,
      key: apiKeys.key,
    })
    .from(apiKeys)
    .where(eq(apiKeys.citizenId, citizenId));

  return keys.map((k) => ({
    ...k,
    keyHint: "..." + k.key.slice(-4),
    key: undefined,
  }));
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
    .where(eq(apiKeys.key, key))
    .limit(1);

  if (result.length === 0) return null;

  // Update lastUsedAt (fire-and-forget)
  db.update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, result[0].keyId))
    .then(() => {})
    .catch(() => {});

  return result[0].citizen;
}
