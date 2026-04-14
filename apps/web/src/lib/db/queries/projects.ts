import { db } from "@/lib/db";
import { projects, problems, citizens } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getProjects(category?: string) {
  const conditions = [eq(projects.visibility, "public")];

  if (category) {
    conditions.push(eq(problems.category, category));
  }

  return db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      description: projects.description,
      visibility: projects.visibility,
      repoUrl: projects.repoUrl,
      createdAt: projects.createdAt,
      problem: {
        id: problems.id,
        title: problems.title,
        category: problems.category,
      },
      owner: {
        id: citizens.id,
        username: citizens.username,
        avatarUrl: citizens.avatarUrl,
      },
    })
    .from(projects)
    .leftJoin(problems, eq(projects.problemId, problems.id))
    .leftJoin(citizens, eq(projects.ownerId, citizens.id))
    .where(and(...conditions))
    .orderBy(desc(projects.createdAt));
}

export async function getProjectBySlug(slug: string) {
  const result = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      description: projects.description,
      repoUrl: projects.repoUrl,
      visibility: projects.visibility,
      minCitizenScore: projects.minCitizenScore,
      createdAt: projects.createdAt,
      problem: {
        id: problems.id,
        title: problems.title,
        category: problems.category,
      },
      owner: {
        id: citizens.id,
        username: citizens.username,
        avatarUrl: citizens.avatarUrl,
      },
    })
    .from(projects)
    .leftJoin(problems, eq(projects.problemId, problems.id))
    .leftJoin(citizens, eq(projects.ownerId, citizens.id))
    .where(eq(projects.slug, slug))
    .limit(1);

  return result[0] ?? null;
}

export async function getProjectById(id: string) {
  const result = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      description: projects.description,
      repoUrl: projects.repoUrl,
      visibility: projects.visibility,
      minCitizenScore: projects.minCitizenScore,
      createdAt: projects.createdAt,
      problem: {
        id: problems.id,
        title: problems.title,
        category: problems.category,
      },
      owner: {
        id: citizens.id,
        username: citizens.username,
        avatarUrl: citizens.avatarUrl,
      },
    })
    .from(projects)
    .leftJoin(problems, eq(projects.problemId, problems.id))
    .leftJoin(citizens, eq(projects.ownerId, citizens.id))
    .where(eq(projects.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getProjectsByProblemId(problemId: string) {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      description: projects.description,
      visibility: projects.visibility,
    })
    .from(projects)
    .where(eq(projects.problemId, problemId))
    .orderBy(desc(projects.createdAt));
}

export async function createProject(data: {
  problemId: string;
  name: string;
  slug: string;
  description: string;
  repoUrl?: string;
  ownerId: string;
}) {
  const [project] = await db.insert(projects).values(data).returning();
  return project;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name);
  const existing = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(eq(projects.slug, base))
    .limit(1);

  if (existing.length === 0) return base;

  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}
