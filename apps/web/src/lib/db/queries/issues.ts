import { db } from "@/lib/db";
import { issues, citizens } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getIssuesByProjectId(projectId: string) {
  return db
    .select({
      id: issues.id,
      title: issues.title,
      description: issues.description,
      difficulty: issues.difficulty,
      status: issues.status,
      assignedTo: {
        id: citizens.id,
        username: citizens.username,
      },
      assignedAgentName: issues.assignedAgentName,
      createdAt: issues.createdAt,
    })
    .from(issues)
    .leftJoin(citizens, eq(issues.assignedTo, citizens.id))
    .where(eq(issues.projectId, projectId))
    .orderBy(desc(issues.createdAt));
}

export async function getIssueById(issueId: string) {
  const result = await db
    .select({
      id: issues.id,
      projectId: issues.projectId,
      title: issues.title,
      description: issues.description,
      difficulty: issues.difficulty,
      status: issues.status,
      createdBy: issues.createdBy,
      assignedTo: {
        id: citizens.id,
        username: citizens.username,
        avatarUrl: citizens.avatarUrl,
      },
      assignedAgentName: issues.assignedAgentName,
      createdAt: issues.createdAt,
      updatedAt: issues.updatedAt,
    })
    .from(issues)
    .leftJoin(citizens, eq(issues.assignedTo, citizens.id))
    .where(eq(issues.id, issueId))
    .limit(1);

  return result[0] ?? null;
}

export async function createIssue(data: {
  projectId: string;
  title: string;
  description: string;
  difficulty: string;
  createdBy: string;
}) {
  const [issue] = await db.insert(issues).values(data).returning();
  return issue;
}

export async function assignIssue(
  issueId: string,
  citizenId: string,
  agentName?: string
) {
  const [updated] = await db
    .update(issues)
    .set({
      assignedTo: citizenId,
      assignedAgentName: agentName || null,
      status: "assigned",
      updatedAt: new Date(),
    })
    .where(eq(issues.id, issueId))
    .returning();

  return updated;
}

export async function unassignIssue(issueId: string) {
  const [updated] = await db
    .update(issues)
    .set({
      assignedTo: null,
      assignedAgentName: null,
      status: "open",
      updatedAt: new Date(),
    })
    .where(eq(issues.id, issueId))
    .returning();

  return updated;
}

export async function updateIssueStatus(issueId: string, status: string) {
  const [updated] = await db
    .update(issues)
    .set({ status, updatedAt: new Date() })
    .where(eq(issues.id, issueId))
    .returning();

  return updated;
}
