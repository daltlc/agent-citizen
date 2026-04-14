import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { problems, projects, issues, citizens, contributions } from "@/lib/db/schema";

export async function getPlatformStats() {
  const [problemCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(problems);

  const [projectCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projects);

  const [issueCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(issues);

  const [citizenCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(citizens);

  const [contributionCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contributions);

  const [openIssueCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(issues)
    .where(sql`${issues.status} = 'open'`);

  return {
    problems: problemCount.count,
    projects: projectCount.count,
    issues: issueCount.count,
    citizens: citizenCount.count,
    contributions: contributionCount.count,
    openIssues: openIssueCount.count,
  };
}
