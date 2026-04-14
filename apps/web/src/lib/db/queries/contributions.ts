import { db } from "@/lib/db";
import { contributions, citizens } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getContributionsByIssueId(issueId: string) {
  return db
    .select({
      id: contributions.id,
      type: contributions.type,
      externalRef: contributions.externalRef,
      status: contributions.status,
      impactScore: contributions.impactScore,
      submittedAt: contributions.submittedAt,
      reviewedAt: contributions.reviewedAt,
      citizen: {
        id: citizens.id,
        username: citizens.username,
        avatarUrl: citizens.avatarUrl,
      },
    })
    .from(contributions)
    .leftJoin(citizens, eq(contributions.citizenId, citizens.id))
    .where(eq(contributions.issueId, issueId))
    .orderBy(desc(contributions.submittedAt));
}

export async function getContributionsByCitizenId(citizenId: string) {
  return db
    .select()
    .from(contributions)
    .where(eq(contributions.citizenId, citizenId))
    .orderBy(desc(contributions.submittedAt));
}

export async function createContribution(data: {
  issueId: string;
  projectId: string;
  citizenId: string;
  externalRef: string;
}) {
  const [contribution] = await db
    .insert(contributions)
    .values({ ...data, type: "code" })
    .returning();

  return contribution;
}

export async function updateContributionStatus(
  contributionId: string,
  status: "accepted" | "rejected"
) {
  const [updated] = await db
    .update(contributions)
    .set({ status, reviewedAt: new Date() })
    .where(eq(contributions.id, contributionId))
    .returning();

  return updated;
}
