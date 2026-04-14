export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { getProjectBySlug } from "@/lib/db/queries/projects";
import { getIssueById } from "@/lib/db/queries/issues";
import { getContributionsByIssueId } from "@/lib/db/queries/contributions";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { AssignButton } from "@/components/issues/assign-button";
import { AgentActions } from "@/components/issues/agent-actions";
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

        <p className="whitespace-pre-wrap text-citizen-sand">
          {issue.description}
        </p>
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
