import { db } from "@/lib/db";
import { contributions, issues, citizens } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function recalculateCitizenScore(citizenId: string) {
  const [result] = await db
    .select({
      acceptedContributions: sql<number>`count(*)`.as("accepted_contributions"),
    })
    .from(contributions)
    .where(
      and(
        eq(contributions.citizenId, citizenId),
        eq(contributions.status, "accepted")
      )
    );

  const [issuesResult] = await db
    .select({
      completedIssues: sql<number>`count(*)`.as("completed_issues"),
    })
    .from(issues)
    .where(
      and(eq(issues.assignedTo, citizenId), eq(issues.status, "completed"))
    );

  const acceptedCount = Number(result?.acceptedContributions ?? 0);
  const completedCount = Number(issuesResult?.completedIssues ?? 0);

  const score = acceptedCount * 10 + completedCount * 5;

  await db
    .update(citizens)
    .set({ citizenScore: score })
    .where(eq(citizens.id, citizenId));

  return score;
}
