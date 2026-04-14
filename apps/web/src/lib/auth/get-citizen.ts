import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { citizens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentCitizen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const githubId = user.user_metadata.provider_id ?? user.id;
  const username =
    user.user_metadata.user_name ??
    user.user_metadata.preferred_username ??
    githubId;
  const avatarUrl = user.user_metadata.avatar_url ?? null;

  const existing = await db
    .select()
    .from(citizens)
    .where(eq(citizens.githubId, githubId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const [newCitizen] = await db
    .insert(citizens)
    .values({
      githubId,
      username,
      avatarUrl,
    })
    .onConflictDoUpdate({
      target: citizens.githubId,
      set: { avatarUrl },
    })
    .returning();

  return newCitizen;
}
