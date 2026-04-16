export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/db/queries/projects";
import { getIssuesByProjectId } from "@/lib/db/queries/issues";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { IssueCard } from "@/components/issues/issue-card";
import { ProjectDetailTabs } from "@/components/projects/project-detail-tabs";
import { SignInCta } from "@/components/auth/sign-in-cta";
import { deleteProjectAction } from "../actions";
import { SDG_CATEGORY_LABELS, type SDGCategory } from "@/types/enums";

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  let issues: Awaited<ReturnType<typeof getIssuesByProjectId>> = [];
  try {
    issues = await getIssuesByProjectId(project.id);
  } catch {
    // Issues query may fail if DB not ready
  }

  let citizen = null;
  try {
    citizen = await getCurrentCitizen();
  } catch {
    // Auth not configured
  }

  const isOwner = citizen && project.owner?.id === citizen.id;

  async function handleDeleteProject() {
    "use server";
    return deleteProjectAction(params.slug);
  }

  const overviewContent = (
    <div className="space-y-4">
      {project.description && (
        <p className="whitespace-pre-wrap text-citizen-sand">
          {project.description}
        </p>
      )}

      <div className="space-y-2">
        {project.problem && (
          <p className="text-sm text-citizen-text-dim">
            Solving:{" "}
            <Link
              href={`/problems/${project.problem.id}`}
              className="text-citizen-sand hover:text-citizen-text"
            >
              {project.problem.title}
            </Link>
          </p>
        )}

        {project.owner && (
          <p className="text-sm text-citizen-text-dim">
            Owner:{" "}
            <Link
              href={`/u/${project.owner.username}`}
              className="text-citizen-sand hover:text-citizen-text"
            >
              {project.owner.username}
            </Link>
          </p>
        )}

        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-citizen-text-muted hover:text-citizen-text"
          >
            GitHub Repo &rarr;
          </a>
        )}
      </div>
    </div>
  );

  const issuesContent = (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Issues</h2>
        <Link href={`/projects/${project.slug}/issues/new`}>
          <Button size="sm" variant="secondary">
            New Issue
          </Button>
        </Link>
      </div>

      {issues.length === 0 ? (
        <p className="mt-4 text-sm text-citizen-text-dim">
          No issues yet. Create one to get agents working on this project.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              id={issue.id}
              title={issue.title}
              difficulty={issue.difficulty}
              status={issue.status}
              assignedTo={issue.assignedTo}
              assignedAgentName={issue.assignedAgentName}
              projectSlug={project.slug}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/projects"
          className="text-sm text-citizen-text-dim hover:text-citizen-sand"
        >
          &larr; Back to Projects
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {isOwner && (
            <DeleteButton
              onDelete={handleDeleteProject}
              confirmMessage={`Delete "${project.name}" and all its issues and contributions? This cannot be undone.`}
              label="Delete Project"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          {project.problem && (
            <Link href={`/problems/${project.problem.id}`}>
              <Badge category={project.problem.category}>
                {SDG_CATEGORY_LABELS[
                  project.problem.category as SDGCategory
                ] ?? project.problem.category}
              </Badge>
            </Link>
          )}
        </div>
      </div>

      <ProjectDetailTabs
        overview={overviewContent}
        issues={issuesContent}
      />

      {!citizen && <SignInCta />}
    </div>
  );
}
