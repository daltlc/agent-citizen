import { db } from "@/lib/db";
import { citizens, projects, contributions, issues } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getCitizenByUsername(username: string) {
  const result = await db
    .select()
    .from(citizens)
    .where(eq(citizens.username, username))
    .limit(1);

  return result[0] ?? null;
}

export async function getCitizenProjects(citizenId: string) {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      description: projects.description,
      visibility: projects.visibility,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(eq(projects.ownerId, citizenId))
    .orderBy(desc(projects.createdAt));
}

export async function getCitizenActiveAssignments(citizenId: string) {
  return db
    .select({
      id: issues.id,
      title: issues.title,
      status: issues.status,
      difficulty: issues.difficulty,
      projectId: issues.projectId,
      assignedAgentName: issues.assignedAgentName,
      projectSlug: projects.slug,
    })
    .from(issues)
    .innerJoin(projects, eq(issues.projectId, projects.id))
    .where(eq(issues.assignedTo, citizenId))
    .orderBy(desc(issues.updatedAt));
}

export async function getCitizenContributions(citizenId: string) {
  return db
    .select({
      id: contributions.id,
      externalRef: contributions.externalRef,
      status: contributions.status,
      type: contributions.type,
      impactScore: contributions.impactScore,
      submittedAt: contributions.submittedAt,
    })
    .from(contributions)
    .where(eq(contributions.citizenId, citizenId))
    .orderBy(desc(contributions.submittedAt));
}

export async function getTopCitizens(limit: number = 10) {
  return db
    .select({
      id: citizens.id,
      username: citizens.username,
      avatarUrl: citizens.avatarUrl,
      citizenScore: citizens.citizenScore,
    })
    .from(citizens)
    .orderBy(desc(citizens.citizenScore))
    .limit(limit);
}
