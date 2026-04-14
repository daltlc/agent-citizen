"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { getProjectBySlug } from "@/lib/db/queries/projects";
import {
  createIssue,
  assignIssue,
  unassignIssue,
  getIssueById,
  updateIssueStatus,
  deleteIssue,
} from "@/lib/db/queries/issues";
import {
  createContribution,
  updateContributionStatus,
} from "@/lib/db/queries/contributions";
import { recalculateCitizenScore } from "@/lib/score/calculate";
import { commentOnPr } from "@/lib/github/comment-on-pr";
import { ISSUE_DIFFICULTIES } from "@/types/enums";
import type { ActionState } from "@/types/actions";

const createIssueSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  difficulty: z.enum(ISSUE_DIFFICULTIES),
});

export async function createIssueAction(
  projectSlug: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const citizen = await getCurrentCitizen();
  if (!citizen) return { error: "Must be signed in" };

  const project = await getProjectBySlug(projectSlug);
  if (!project) return { error: "Project not found" };
  if (project.owner?.id !== citizen.id) {
    return { error: "Only the project owner can create issues" };
  }

  const result = createIssueSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    difficulty: formData.get("difficulty"),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  await createIssue({
    projectId: project.id,
    title: result.data.title,
    description: result.data.description,
    difficulty: result.data.difficulty,
    createdBy: citizen.id,
  });

  redirect(`/projects/${projectSlug}`);
}

const assignIssueSchema = z.object({
  agentName: z.string().max(50).optional(),
});

export async function assignIssueAction(
  issueId: string,
  projectSlug: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const citizen = await getCurrentCitizen();
  if (!citizen) return { error: "Must be signed in" };

  const issue = await getIssueById(issueId);
  if (!issue) return { error: "Issue not found" };
  if (issue.status !== "open") return { error: "Issue is not open for assignment" };

  const result = assignIssueSchema.safeParse({
    agentName: formData.get("agentName") || undefined,
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  await assignIssue(issueId, citizen.id, result.data.agentName);
  revalidatePath(`/projects/${projectSlug}/issues/${issueId}`);
  return { error: null };
}

export async function unassignIssueAction(
  issueId: string,
  projectSlug: string
): Promise<ActionState> {
  const citizen = await getCurrentCitizen();
  if (!citizen) return { error: "Must be signed in" };

  const issue = await getIssueById(issueId);
  if (!issue) return { error: "Issue not found" };
  if (issue.assignedTo?.id !== citizen.id) {
    return { error: "You are not assigned to this issue" };
  }
  if (issue.status !== "assigned" && issue.status !== "in_progress") {
    return { error: "Cannot unassign. Issue is in review or completed" };
  }

  await unassignIssue(issueId);
  revalidatePath(`/projects/${projectSlug}/issues/${issueId}`);
  return { error: null };
}

const submitContributionSchema = z.object({
  externalRef: z.string().min(1).max(500).url("Please enter a valid URL (e.g. https://github.com/org/repo/pull/1)"),
});

export async function submitContributionAction(
  issueId: string,
  projectSlug: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const citizen = await getCurrentCitizen();
  if (!citizen) return { error: "Must be signed in" };

  const issue = await getIssueById(issueId);
  if (!issue) return { error: "Issue not found" };
  if (issue.assignedTo?.id !== citizen.id) {
    return { error: "You are not assigned to this issue" };
  }

  const result = submitContributionSchema.safeParse({
    externalRef: formData.get("externalRef"),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  await createContribution({
    issueId,
    projectId: issue.projectId,
    citizenId: citizen.id,
    externalRef: result.data.externalRef,
  });

  await updateIssueStatus(issueId, "in_review");
  revalidatePath(`/projects/${projectSlug}/issues/${issueId}`);
  return { error: null };
}

export async function reviewContributionAction(
  contributionId: string,
  issueId: string,
  projectSlug: string,
  decision: "accepted" | "rejected"
): Promise<ActionState> {
  const citizen = await getCurrentCitizen();
  if (!citizen) return { error: "Must be signed in" };

  const issue = await getIssueById(issueId);
  if (!issue) return { error: "Issue not found" };

  const project = await getProjectBySlug(projectSlug);
  if (!project) return { error: "Project not found" };
  if (project.owner?.id !== citizen.id) {
    return { error: "Only the project owner can review contributions" };
  }

  const contribution = await updateContributionStatus(contributionId, decision);

  if (decision === "accepted") {
    await updateIssueStatus(issueId, "completed");
    await recalculateCitizenScore(contribution.citizenId);
  } else {
    await updateIssueStatus(issueId, "assigned");
  }

  // Post a comment on the GitHub PR (best-effort, doesn't block the review)
  const issueUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/projects/${projectSlug}/issues/${issueId}`;
  if (decision === "accepted") {
    commentOnPr(
      contribution.externalRef,
      `### Accepted on Agent Citizen\n\nThis contribution has been accepted by the project owner. The contributor's Citizen Score has been updated.\n\n[View on Agent Citizen](${issueUrl})`
    );
  } else {
    commentOnPr(
      contribution.externalRef,
      `### Rejected on Agent Citizen\n\nThis contribution has been rejected by the project owner. The issue has been reopened for further work.\n\n[View on Agent Citizen](${issueUrl})`
    );
  }

  revalidatePath(`/projects/${projectSlug}/issues/${issueId}`);
  return { error: null };
}

export async function deleteIssueAction(
  issueId: string,
  projectSlug: string
): Promise<ActionState> {
  const citizen = await getCurrentCitizen();
  if (!citizen) return { error: "Must be signed in" };

  const project = await getProjectBySlug(projectSlug);
  if (!project) return { error: "Project not found" };
  if (project.owner?.id !== citizen.id) {
    return { error: "Only the project owner can delete issues" };
  }

  const issue = await getIssueById(issueId);
  if (!issue) return { error: "Issue not found" };

  await deleteIssue(issueId);
  redirect(`/projects/${projectSlug}`);
}
