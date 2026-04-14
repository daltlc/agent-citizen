import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetCurrentCitizen = vi.fn();
const mockGetProjectBySlug = vi.fn();
const mockGetIssueById = vi.fn();
const mockCreateIssue = vi.fn();
const mockAssignIssue = vi.fn();
const mockUnassignIssue = vi.fn();
const mockUpdateIssueStatus = vi.fn();
const mockDeleteIssue = vi.fn();
const mockCreateContribution = vi.fn();
const mockUpdateContributionStatus = vi.fn();
const mockRecalculateCitizenScore = vi.fn();
const mockCommentOnPr = vi.fn();
const mockRedirect = vi.fn();
const mockRevalidatePath = vi.fn();

vi.mock("@/lib/auth/get-citizen", () => ({
  getCurrentCitizen: () => mockGetCurrentCitizen(),
}));
vi.mock("@/lib/db/queries/projects", () => ({
  getProjectBySlug: (...args: unknown[]) => mockGetProjectBySlug(...args),
}));
vi.mock("@/lib/db/queries/issues", () => ({
  createIssue: (...args: unknown[]) => mockCreateIssue(...args),
  assignIssue: (...args: unknown[]) => mockAssignIssue(...args),
  unassignIssue: (...args: unknown[]) => mockUnassignIssue(...args),
  getIssueById: (...args: unknown[]) => mockGetIssueById(...args),
  updateIssueStatus: (...args: unknown[]) => mockUpdateIssueStatus(...args),
  deleteIssue: (...args: unknown[]) => mockDeleteIssue(...args),
}));
vi.mock("@/lib/db/queries/contributions", () => ({
  createContribution: (...args: unknown[]) => mockCreateContribution(...args),
  updateContributionStatus: (...args: unknown[]) =>
    mockUpdateContributionStatus(...args),
}));
vi.mock("@/lib/score/calculate", () => ({
  recalculateCitizenScore: (...args: unknown[]) =>
    mockRecalculateCitizenScore(...args),
}));
vi.mock("@/lib/github/comment-on-pr", () => ({
  commentOnPr: (...args: unknown[]) => mockCommentOnPr(...args),
}));
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args);
    throw new Error("NEXT_REDIRECT");
  },
}));
vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}));

import {
  createIssueAction,
  assignIssueAction,
  unassignIssueAction,
  submitContributionAction,
  reviewContributionAction,
  deleteIssueAction,
} from "./actions";

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

const owner = { id: "owner-1", username: "owner" };
const citizen = { id: "citizen-1", username: "contributor" };
const project = {
  id: "project-1",
  slug: "test-project",
  owner: { id: "owner-1" },
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createIssueAction ───────────────────────────────────────────────

describe("createIssueAction", () => {
  it("returns error when not signed in", async () => {
    mockGetCurrentCitizen.mockResolvedValue(null);

    const result = await createIssueAction(
      "test-project",
      { error: null },
      makeFormData({
        title: "Test Issue",
        description: "A valid issue description",
        difficulty: "beginner",
      })
    );

    expect(result.error).toBe("Must be signed in");
  });

  it("returns error when project is not found", async () => {
    mockGetCurrentCitizen.mockResolvedValue(owner);
    mockGetProjectBySlug.mockResolvedValue(null);

    const result = await createIssueAction(
      "nonexistent-project",
      { error: null },
      makeFormData({
        title: "Test Issue",
        description: "A valid issue description",
        difficulty: "beginner",
      })
    );

    expect(result.error).toBe("Project not found");
  });

  it("returns error when user is not the project owner", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetProjectBySlug.mockResolvedValue(project);

    const result = await createIssueAction(
      "test-project",
      { error: null },
      makeFormData({
        title: "Test Issue",
        description: "A valid issue description",
        difficulty: "beginner",
      })
    );

    expect(result.error).toBe("Only the project owner can create issues");
  });

  it("returns validation error for invalid form data", async () => {
    mockGetCurrentCitizen.mockResolvedValue(owner);
    mockGetProjectBySlug.mockResolvedValue(project);

    const result = await createIssueAction(
      "test-project",
      { error: null },
      makeFormData({
        title: "ab",
        description: "short",
        difficulty: "impossible",
      })
    );

    expect(result.error).toBeTruthy();
  });

  it("creates issue and redirects on valid input", async () => {
    mockGetCurrentCitizen.mockResolvedValue(owner);
    mockGetProjectBySlug.mockResolvedValue(project);
    mockCreateIssue.mockResolvedValue({ id: "issue-1" });

    await expect(
      createIssueAction(
        "test-project",
        { error: null },
        makeFormData({
          title: "Fix the water pump",
          description: "The pump module is broken and needs repair code",
          difficulty: "intermediate",
        })
      )
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(mockCreateIssue).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: "project-1",
        title: "Fix the water pump",
        difficulty: "intermediate",
        createdBy: "owner-1",
      })
    );
  });
});

// ─── assignIssueAction ───────────────────────────────────────────────

describe("assignIssueAction", () => {
  it("returns error when not signed in", async () => {
    mockGetCurrentCitizen.mockResolvedValue(null);

    const result = await assignIssueAction(
      "issue-1",
      "test-project",
      { error: null },
      makeFormData({})
    );

    expect(result.error).toBe("Must be signed in");
  });

  it("returns error when issue is not found", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue(null);

    const result = await assignIssueAction(
      "nonexistent-issue",
      "test-project",
      { error: null },
      makeFormData({})
    );

    expect(result.error).toBe("Issue not found");
  });

  it("returns error when issue is not open", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({
      id: "issue-1",
      status: "assigned",
    });

    const result = await assignIssueAction(
      "issue-1",
      "test-project",
      { error: null },
      makeFormData({})
    );

    expect(result.error).toBe("Issue is not open for assignment");
  });

  it("assigns issue without agent name", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({ id: "issue-1", status: "open" });
    mockAssignIssue.mockResolvedValue(undefined);

    const result = await assignIssueAction(
      "issue-1",
      "test-project",
      { error: null },
      makeFormData({})
    );

    expect(result.error).toBeNull();
    expect(mockAssignIssue).toHaveBeenCalledWith(
      "issue-1",
      "citizen-1",
      undefined
    );
  });

  it("assigns issue and revalidates on valid input", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({ id: "issue-1", status: "open" });
    mockAssignIssue.mockResolvedValue(undefined);

    const result = await assignIssueAction(
      "issue-1",
      "test-project",
      { error: null },
      makeFormData({ agentName: "Claude" })
    );

    expect(result.error).toBeNull();
    expect(mockAssignIssue).toHaveBeenCalledWith(
      "issue-1",
      "citizen-1",
      "Claude"
    );
    expect(mockRevalidatePath).toHaveBeenCalledWith(
      "/projects/test-project/issues/issue-1"
    );
  });
});

// ─── unassignIssueAction ─────────────────────────────────────────────

describe("unassignIssueAction", () => {
  it("returns error when not signed in", async () => {
    mockGetCurrentCitizen.mockResolvedValue(null);

    const result = await unassignIssueAction("issue-1", "test-project");

    expect(result.error).toBe("Must be signed in");
  });

  it("returns error when user is not assigned to the issue", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({
      id: "issue-1",
      status: "assigned",
      assignedTo: { id: "someone-else" },
    });

    const result = await unassignIssueAction("issue-1", "test-project");

    expect(result.error).toBe("You are not assigned to this issue");
  });

  it("returns error when issue is in review", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({
      id: "issue-1",
      status: "in_review",
      assignedTo: { id: "citizen-1" },
    });

    const result = await unassignIssueAction("issue-1", "test-project");

    expect(result.error).toBe(
      "Cannot unassign. Issue is in review or completed"
    );
  });

  it("returns error when issue is completed", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({
      id: "issue-1",
      status: "completed",
      assignedTo: { id: "citizen-1" },
    });

    const result = await unassignIssueAction("issue-1", "test-project");

    expect(result.error).toBe(
      "Cannot unassign. Issue is in review or completed"
    );
  });

  it("unassigns and revalidates on valid input", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({
      id: "issue-1",
      status: "assigned",
      assignedTo: { id: "citizen-1" },
    });
    mockUnassignIssue.mockResolvedValue(undefined);

    const result = await unassignIssueAction("issue-1", "test-project");

    expect(result.error).toBeNull();
    expect(mockUnassignIssue).toHaveBeenCalledWith("issue-1");
    expect(mockRevalidatePath).toHaveBeenCalled();
  });
});

// ─── submitContributionAction ────────────────────────────────────────

describe("submitContributionAction", () => {
  it("returns error when not signed in", async () => {
    mockGetCurrentCitizen.mockResolvedValue(null);

    const result = await submitContributionAction(
      "issue-1",
      "test-project",
      { error: null },
      makeFormData({ externalRef: "https://github.com/org/repo/pull/1" })
    );

    expect(result.error).toBe("Must be signed in");
  });

  it("returns error when issue is not found", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue(null);

    const result = await submitContributionAction(
      "nonexistent-issue",
      "test-project",
      { error: null },
      makeFormData({ externalRef: "https://github.com/org/repo/pull/1" })
    );

    expect(result.error).toBe("Issue not found");
  });

  it("returns error when user is not assigned to the issue", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({
      id: "issue-1",
      assignedTo: { id: "someone-else" },
      projectId: "project-1",
    });

    const result = await submitContributionAction(
      "issue-1",
      "test-project",
      { error: null },
      makeFormData({ externalRef: "https://github.com/org/repo/pull/1" })
    );

    expect(result.error).toBe("You are not assigned to this issue");
  });

  it("returns validation error for invalid URL", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({
      id: "issue-1",
      assignedTo: { id: "citizen-1" },
      projectId: "project-1",
    });

    const result = await submitContributionAction(
      "issue-1",
      "test-project",
      { error: null },
      makeFormData({ externalRef: "not-a-url" })
    );

    expect(result.error).toBeTruthy();
  });

  it("creates contribution and updates issue status on valid input", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({
      id: "issue-1",
      assignedTo: { id: "citizen-1" },
      projectId: "project-1",
    });
    mockCreateContribution.mockResolvedValue({ id: "contribution-1" });
    mockUpdateIssueStatus.mockResolvedValue(undefined);

    const result = await submitContributionAction(
      "issue-1",
      "test-project",
      { error: null },
      makeFormData({ externalRef: "https://github.com/org/repo/pull/42" })
    );

    expect(result.error).toBeNull();
    expect(mockCreateContribution).toHaveBeenCalledWith(
      expect.objectContaining({
        issueId: "issue-1",
        projectId: "project-1",
        citizenId: "citizen-1",
        externalRef: "https://github.com/org/repo/pull/42",
      })
    );
    expect(mockUpdateIssueStatus).toHaveBeenCalledWith("issue-1", "in_review");
  });

  it("accepts any valid URL, not just GitHub PR URLs", async () => {
    // NOTE: The schema validates URL format but does not enforce GitHub PR URLs.
    // A future improvement could restrict externalRef to GitHub PR URLs only.
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({
      id: "issue-1",
      assignedTo: { id: "citizen-1" },
      projectId: "project-1",
    });
    mockCreateContribution.mockResolvedValue({ id: "contribution-1" });
    mockUpdateIssueStatus.mockResolvedValue(undefined);

    const result = await submitContributionAction(
      "issue-1",
      "test-project",
      { error: null },
      makeFormData({ externalRef: "https://example.com/not-a-pr" })
    );

    expect(result.error).toBeNull();
  });
});

// ─── reviewContributionAction ────────────────────────────────────────

describe("reviewContributionAction", () => {
  it("returns error when not signed in", async () => {
    mockGetCurrentCitizen.mockResolvedValue(null);

    const result = await reviewContributionAction(
      "contribution-1",
      "issue-1",
      "test-project",
      "accepted"
    );

    expect(result.error).toBe("Must be signed in");
  });

  it("returns error when issue is not found", async () => {
    mockGetCurrentCitizen.mockResolvedValue(owner);
    mockGetIssueById.mockResolvedValue(null);

    const result = await reviewContributionAction(
      "contribution-1",
      "nonexistent-issue",
      "test-project",
      "accepted"
    );

    expect(result.error).toBe("Issue not found");
  });

  it("returns error when project is not found", async () => {
    mockGetCurrentCitizen.mockResolvedValue(owner);
    mockGetIssueById.mockResolvedValue({ id: "issue-1" });
    mockGetProjectBySlug.mockResolvedValue(null);

    const result = await reviewContributionAction(
      "contribution-1",
      "issue-1",
      "nonexistent-project",
      "accepted"
    );

    expect(result.error).toBe("Project not found");
  });

  it("returns error when user is not project owner", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetIssueById.mockResolvedValue({ id: "issue-1" });
    mockGetProjectBySlug.mockResolvedValue(project);

    const result = await reviewContributionAction(
      "contribution-1",
      "issue-1",
      "test-project",
      "accepted"
    );

    expect(result.error).toBe(
      "Only the project owner can review contributions"
    );
  });

  it("accepts contribution: updates status, completes issue, recalculates score", async () => {
    mockGetCurrentCitizen.mockResolvedValue(owner);
    mockGetIssueById.mockResolvedValue({ id: "issue-1" });
    mockGetProjectBySlug.mockResolvedValue(project);
    mockUpdateContributionStatus.mockResolvedValue({
      citizenId: "citizen-1",
      externalRef: "https://github.com/org/repo/pull/1",
    });
    mockUpdateIssueStatus.mockResolvedValue(undefined);
    mockRecalculateCitizenScore.mockResolvedValue(15);
    mockCommentOnPr.mockResolvedValue(true);

    const result = await reviewContributionAction(
      "contribution-1",
      "issue-1",
      "test-project",
      "accepted"
    );

    expect(result.error).toBeNull();
    expect(mockUpdateContributionStatus).toHaveBeenCalledWith(
      "contribution-1",
      "accepted"
    );
    expect(mockUpdateIssueStatus).toHaveBeenCalledWith(
      "issue-1",
      "completed"
    );
    expect(mockRecalculateCitizenScore).toHaveBeenCalledWith("citizen-1");
    expect(mockCommentOnPr).toHaveBeenCalledWith(
      "https://github.com/org/repo/pull/1",
      expect.stringContaining("Accepted on Agent Citizen")
    );
  });

  it("rejects contribution: reopens issue to assigned, does not recalculate score", async () => {
    mockGetCurrentCitizen.mockResolvedValue(owner);
    mockGetIssueById.mockResolvedValue({ id: "issue-1" });
    mockGetProjectBySlug.mockResolvedValue(project);
    mockUpdateContributionStatus.mockResolvedValue({
      citizenId: "citizen-1",
      externalRef: "https://github.com/org/repo/pull/1",
    });
    mockUpdateIssueStatus.mockResolvedValue(undefined);
    mockCommentOnPr.mockResolvedValue(true);

    const result = await reviewContributionAction(
      "contribution-1",
      "issue-1",
      "test-project",
      "rejected"
    );

    expect(result.error).toBeNull();
    expect(mockUpdateIssueStatus).toHaveBeenCalledWith("issue-1", "assigned");
    expect(mockRecalculateCitizenScore).not.toHaveBeenCalled();
    expect(mockCommentOnPr).toHaveBeenCalledWith(
      "https://github.com/org/repo/pull/1",
      expect.stringContaining("Rejected on Agent Citizen")
    );
  });
});

describe("deleteIssueAction", () => {
  const project = {
    id: "project-1",
    name: "Test Project",
    slug: "test-project",
    owner: { id: "owner-1", username: "owner", avatarUrl: null },
  };

  const issue = {
    id: "issue-1",
    projectId: "project-1",
    title: "Test Issue",
    status: "open",
    createdBy: "owner-1",
    assignedTo: null,
  };

  it("returns error when not signed in", async () => {
    mockGetCurrentCitizen.mockResolvedValue(null);
    const result = await deleteIssueAction("issue-1", "test-project");
    expect(result.error).toBe("Must be signed in");
  });

  it("returns error when project not found", async () => {
    mockGetCurrentCitizen.mockResolvedValue(owner);
    mockGetProjectBySlug.mockResolvedValue(null);
    const result = await deleteIssueAction("issue-1", "nonexistent");
    expect(result.error).toBe("Project not found");
  });

  it("returns error when user is not the project owner", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGetProjectBySlug.mockResolvedValue(project);
    const result = await deleteIssueAction("issue-1", "test-project");
    expect(result.error).toBe("Only the project owner can delete issues");
  });

  it("returns error when issue not found", async () => {
    mockGetCurrentCitizen.mockResolvedValue(owner);
    mockGetProjectBySlug.mockResolvedValue(project);
    mockGetIssueById.mockResolvedValue(null);
    const result = await deleteIssueAction("issue-1", "test-project");
    expect(result.error).toBe("Issue not found");
  });

  it("deletes issue and redirects to project page", async () => {
    mockGetCurrentCitizen.mockResolvedValue(owner);
    mockGetProjectBySlug.mockResolvedValue(project);
    mockGetIssueById.mockResolvedValue(issue);
    mockDeleteIssue.mockResolvedValue(issue);

    await expect(
      deleteIssueAction("issue-1", "test-project")
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(mockDeleteIssue).toHaveBeenCalledWith("issue-1");
    expect(mockRedirect).toHaveBeenCalledWith("/projects/test-project");
  });
});
