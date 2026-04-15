export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getIssueById } from "@/lib/db/queries/issues";
import { getProjectById } from "@/lib/db/queries/projects";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { rateLimitedResponse } from "@/lib/rate-limit-response";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = getClientIp(request);
  const limit = await rateLimit(ip, "api");
  if (!limit.success) return rateLimitedResponse(limit.reset);

  const parsed = paramsSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
  }

  const issue = await getIssueById(parsed.data.id);
  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const project = await getProjectById(issue.projectId);

  const format = request.nextUrl.searchParams.get("format");

  if (format === "json") {
    return NextResponse.json({
      title: issue.title,
      description: issue.description,
      difficulty: issue.difficulty,
      status: issue.status,
      projectName: project?.name ?? null,
      repoUrl: project?.repoUrl ?? null,
      projectSlug: project?.slug ?? null,
    });
  }

  const parts = [
    `## Issue: ${issue.title}`,
    "",
    `**Project:** ${project?.name ?? "Unknown"}`,
  ];

  if (project?.repoUrl) {
    parts.push(`**Repository:** ${project.repoUrl}`);
  }

  parts.push(
    "",
    "### Description",
    "",
    issue.description,
    "",
    "### Instructions",
    "",
    "Solve this issue by making the necessary code changes. When complete:",
    "1. Create a new branch with a descriptive name",
    "2. Commit your changes with a clear commit message",
    "3. Push and open a pull request",
  );

  return new Response(parts.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
