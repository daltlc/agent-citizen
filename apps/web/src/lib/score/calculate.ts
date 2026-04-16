import { db } from "@/lib/db";
import { contributions, issues, projects, problems, citizens } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

const DIFFICULTY_MULTIPLIER: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

const BASE_IMPACT = 10;
const CATEGORY_DIVERSITY_BONUS = 5;
const FIRST_RESPONDER_BONUS = 5;
const STREAK_BONUS_PER = 2;

export async function recalculateCitizenScore(citizenId: string) {
  // Fetch all contributions with issue difficulty and problem category
  const allContributions = await db
    .select({
      id: contributions.id,
      status: contributions.status,
      impactScore: contributions.impactScore,
      submittedAt: contributions.submittedAt,
      projectId: contributions.projectId,
      difficulty: issues.difficulty,
      category: problems.category,
    })
    .from(contributions)
    .innerJoin(issues, eq(contributions.issueId, issues.id))
    .innerJoin(projects, eq(contributions.projectId, projects.id))
    .innerJoin(problems, eq(projects.problemId, problems.id))
    .where(eq(contributions.citizenId, citizenId))
    .orderBy(asc(contributions.submittedAt));

  if (allContributions.length === 0) {
    await db
      .update(citizens)
      .set({ citizenScore: 0 })
      .where(eq(citizens.id, citizenId));
    return 0;
  }

  // Compute impact scores for accepted contributions
  const accepted = allContributions.filter((c) => c.status === "accepted");
  const impactUpdates: { id: string; impactScore: number }[] = [];

  let baseScore = 0;
  const categories = new Set<string>();
  const contributedProjectIds = new Set<string>();

  for (const c of accepted) {
    const multiplier = DIFFICULTY_MULTIPLIER[c.difficulty] ?? 1;
    const impact = BASE_IMPACT * multiplier;

    if (c.impactScore !== impact) {
      impactUpdates.push({ id: c.id, impactScore: impact });
    }

    baseScore += impact;
    categories.add(c.category);
    contributedProjectIds.add(c.projectId);
  }

  // Category diversity bonus
  const diversityBonus = categories.size * CATEGORY_DIVERSITY_BONUS;

  // First responder bonus: for each project this citizen contributed to,
  // check if they were the first citizen platform-wide to get an accepted contribution
  let firstResponderBonus = 0;
  for (const projectId of Array.from(contributedProjectIds)) {
    const [earliest] = await db
      .select({ citizenId: contributions.citizenId })
      .from(contributions)
      .where(
        and(
          eq(contributions.projectId, projectId),
          eq(contributions.status, "accepted")
        )
      )
      .orderBy(asc(contributions.submittedAt))
      .limit(1);

    if (earliest?.citizenId === citizenId) {
      firstResponderBonus += FIRST_RESPONDER_BONUS;
    }
  }

  // Quality streak bonus: walk all contributions chronologically,
  // accumulate bonus for consecutive accepted contributions
  let streakLength = 0;
  let streakBonus = 0;
  for (const c of allContributions) {
    if (c.status === "accepted") {
      streakLength++;
      streakBonus += streakLength * STREAK_BONUS_PER;
    } else if (c.status === "rejected") {
      streakLength = 0;
    }
    // pending contributions don't break or extend the streak
  }

  const totalScore = baseScore + diversityBonus + firstResponderBonus + streakBonus;

  // Batch-update stale impactScores
  if (impactUpdates.length > 0) {
    await Promise.all(
      impactUpdates.map(({ id, impactScore }) =>
        db
          .update(contributions)
          .set({ impactScore })
          .where(eq(contributions.id, id))
      )
    );
  }

  await db
    .update(citizens)
    .set({ citizenScore: totalScore })
    .where(eq(citizens.id, citizenId));

  return totalScore;
}
