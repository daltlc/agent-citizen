export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { getProjectBySlug } from "@/lib/db/queries/projects";
import { getIssueById } from "@/lib/db/queries/issues";
import { getContributionsByIssueId } from "@/lib/db/queries/contributions";
import { getApiKeysByCitizenId } from "@/lib/auth/api-key";
import { db } from "@/lib/db";
import { citizens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { AssignButton } from "@/components/issues/assign-button";
import { AgentActions } from "@/components/issues/agent-actions";
import { IssueDescription } from "@/components/issues/issue-description";
import { UnassignButton } from "@/components/issues/unassign-button";
import { SubmitContributionForm } from "@/components/issues/submit-contribution-form";
import { ReviewActions } from "@/components/issues/review-actions";
import { DeleteButton } from "@/components/ui/delete-button";
import {
  assignIssueAction,
  submitContributionAction,
  deleteIssueAction,
} from "../actions";
import type { IssueStatus } from "@/types/enums";
import { z } from "zod";

const uuidSchema = z.string().uuid();

function getGitHubIssueUrl(issueNumber: number | null, repoUrl: string | null): string | null {
  if (!issueNumber || !repoUrl) return null;
  return `${repoUrl.replace(/\/$/, "")}/issues/${issueNumber}`;
}

const difficultyVariant: Record<string, "success" | "warning" | "danger"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

export default async function IssueDetailPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  if (!uuidSchema.safeParse(params.id).success) notFound();

  const issue = await getIssueById(params.id);
  if (!issue) notFound();

  const contributions = await getContributionsByIssueId(params.id);

  let citizen = null;
  try {
    citizen = await getCurrentCitizen();
  } catch {
    // Auth not configured
  }

  const githubIssueUrl = getGitHubIssueUrl(issue.githubIssueNumber, project.repoUrl);
  const hasApiKeys = citizen
    ? (await getApiKeysByCitizenId(citizen.id)).length > 0
    : false;
  let cliInstalled = false;
  if (citizen) {
    const [row] = await db
      .select({ cliInstalledAt: citizens.cliInstalledAt })
      .from(citizens)
      .where(eq(citizens.id, citizen.id))
      .limit(1);
    cliInstalled = !!row?.cliInstalledAt;
  }
  const isOwner = citizen && project.owner?.id === citizen.id;
  const isAssigned = citizen && issue.assignedTo?.id === citizen.id;
  const canAssign = citizen && issue.status === "open";
  const canSubmit = isAssigned && (issue.status === "assigned" || issue.status === "in_progress");

  async function handleDeleteIssue() {
    "use server";
    return deleteIssueAction(params.id, params.slug);
  }

  async function handleAssign(prevState: { error: string | null }, formData: FormData) {
    "use server";
    return assignIssueAction(params.id, params.slug, prevState, formData);
  }

  async function handleSubmit(prevState: { error: string | null }, formData: FormData) {
    "use server";
    return submitContributionAction(params.id, params.slug, prevState, formData);
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/projects/${params.slug}`}
          className="text-sm text-citizen-text-dim hover:text-citizen-sand"
        >
          &larr; Back to {project.name}
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{issue.title}</h1>
          <div className="flex items-center gap-3">
            <StatusBadge status={issue.status as IssueStatus} />
            {isOwner && (
              <DeleteButton
                onDelete={handleDeleteIssue}
                confirmMessage={`Delete "${issue.title}" and all its contributions? This cannot be undone.`}
                label="Delete"
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={difficultyVariant[issue.difficulty] ?? "default"}>
            {issue.difficulty}
          </Badge>
          {issue.assignedTo && (
            <span className="text-sm text-citizen-text-muted">
              Assigned to{" "}
              <Link
                href={`/u/${issue.assignedTo.username}`}
                className="text-citizen-text hover:text-citizen-text"
              >
                {issue.assignedTo.username}
              </Link>
              {issue.assignedAgentName && (
                <span className="text-citizen-text-dim">
                  {" "}
                  (via {issue.assignedAgentName})
                </span>
              )}
            </span>
          )}
        </div>

        <IssueDescription description={issue.description} />

        {(githubIssueUrl || project.repoUrl) && (
          <a
            href={githubIssueUrl ?? project.repoUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-citizen-border-subtle bg-citizen-muted px-4 py-2 text-sm font-medium text-citizen-text transition-colors hover:bg-citizen-border-subtle"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            {githubIssueUrl ? "View Issue on GitHub" : "View Repo on GitHub"}
          </a>
        )}
      </div>

      {canAssign && (
        <div className="rounded-lg border border-citizen-border bg-citizen-elevated p-4">
          <h3 className="mb-3 font-medium">Put your agent to work</h3>
          <AssignButton
            action={handleAssign}
            issueId={params.id}
            issueTitle={issue.title}
            issueDescription={issue.description}
            projectName={project.name}
            projectSlug={params.slug}
            repoUrl={project.repoUrl}
            hasApiKeys={hasApiKeys}
            cliInstalled={cliInstalled}
          />
        </div>
      )}

      {isAssigned && (issue.status === "assigned" || issue.status === "in_progress") && (
        <div className="rounded-lg border border-citizen-border bg-citizen-elevated p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">Agent tools</h3>
            <UnassignButton
              issueId={params.id}
              projectSlug={params.slug}
            />
          </div>
          <AgentActions
            issueId={params.id}
            issueTitle={issue.title}
            issueDescription={issue.description}
            projectName={project.name}
            projectSlug={params.slug}
            repoUrl={project.repoUrl}
            hasApiKeys={hasApiKeys}
            cliInstalled={cliInstalled}
          />
        </div>
      )}

      {canSubmit && (
        <div className="rounded-lg border border-citizen-border bg-citizen-elevated p-4">
          <h3 className="mb-3 font-medium">Submit your work</h3>
          <SubmitContributionForm action={handleSubmit} />
        </div>
      )}

      <div className="border-t border-citizen-border pt-6">
        <h2 className="text-xl font-semibold">Contributions</h2>
        {contributions.length === 0 ? (
          <p className="mt-4 text-sm text-citizen-text-dim">
            No contributions yet.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {contributions.map((contribution) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between rounded-lg border border-citizen-border bg-citizen-elevated/80 p-3"
              >
                <div className="space-y-1">
                  <a
                    href={contribution.externalRef.startsWith("http") ? contribution.externalRef : `https://${contribution.externalRef}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    {contribution.externalRef}
                  </a>
                  <div className="flex items-center gap-2">
                    {contribution.citizen && (
                      <span className="text-xs text-citizen-text-dim">
                        {contribution.citizen.username}
                      </span>
                    )}
                    <span className="text-xs text-citizen-text-dim">
                      {contribution.submittedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      contribution.status === "accepted"
                        ? "success"
                        : contribution.status === "rejected"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {contribution.status}
                  </Badge>
                  {isOwner && contribution.status === "pending" && (
                    <ReviewActions
                      contributionId={contribution.id}
                      issueId={params.id}
                      projectSlug={params.slug}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
