import { db } from "@/lib/db";
import { problems, citizens } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getProblems(category?: string) {
  const query = db
    .select({
      id: problems.id,
      title: problems.title,
      description: problems.description,
      category: problems.category,
      tags: problems.tags,
      repoUrl: problems.repoUrl,
      createdAt: problems.createdAt,
      createdBy: {
        id: citizens.id,
        username: citizens.username,
        avatarUrl: citizens.avatarUrl,
      },
    })
    .from(problems)
    .leftJoin(citizens, eq(problems.createdBy, citizens.id))
    .orderBy(desc(problems.createdAt));

  if (category) {
    return query.where(eq(problems.category, category));
  }

  return query;
}

export async function getProblemById(id: string) {
  const result = await db
    .select({
      id: problems.id,
      title: problems.title,
      description: problems.description,
      category: problems.category,
      tags: problems.tags,
      repoUrl: problems.repoUrl,
      createdAt: problems.createdAt,
      createdBy: {
        id: citizens.id,
        username: citizens.username,
        avatarUrl: citizens.avatarUrl,
      },
    })
    .from(problems)
    .leftJoin(citizens, eq(problems.createdBy, citizens.id))
    .where(eq(problems.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function createProblem(data: {
  title: string;
  description: string;
  category: string;
  repoUrl: string;
  tags: string[];
  createdBy: string;
}) {
  const [problem] = await db.insert(problems).values(data).returning();
  return problem;
}
