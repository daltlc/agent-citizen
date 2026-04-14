import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetCurrentCitizen = vi.fn();
const mockCreateProblem = vi.fn();
const mockRedirect = vi.fn();
const mockVerifyRepoExists = vi.fn();

vi.mock("@/lib/auth/get-citizen", () => ({
  getCurrentCitizen: () => mockGetCurrentCitizen(),
}));
vi.mock("@/lib/db/queries/problems", () => ({
  createProblem: (...args: unknown[]) => mockCreateProblem(...args),
}));
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args);
    throw new Error("NEXT_REDIRECT");
  },
}));
vi.mock("@/lib/github/validate-repo", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/github/validate-repo")>();
  return {
    ...actual,
    verifyRepoExists: (...args: unknown[]) => mockVerifyRepoExists(...args),
  };
});

import { createProblemAction } from "./actions";

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

const citizen = { id: "citizen-1", username: "testuser" };

beforeEach(() => {
  vi.clearAllMocks();
  mockVerifyRepoExists.mockResolvedValue(true);
});

describe("createProblemAction", () => {
  it("returns error when not signed in", async () => {
    mockGetCurrentCitizen.mockResolvedValue(null);

    const result = await createProblemAction(
      { error: null },
      makeFormData({
        title: "Test Problem",
        description: "A valid description here",
        category: "climate",
        repoUrl: "https://github.com/owner/repo",
      })
    );

    expect(result.error).toBe("Must be signed in to create a problem");
  });

  it("returns validation error for title too short", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);

    const result = await createProblemAction(
      { error: null },
      makeFormData({
        title: "ab",
        description: "A valid description here",
        category: "climate",
        repoUrl: "https://github.com/owner/repo",
      })
    );

    expect(result.error).toBeTruthy();
  });

  it("returns validation error for invalid category", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);

    const result = await createProblemAction(
      { error: null },
      makeFormData({
        title: "Valid Title",
        description: "A valid description here",
        category: "invalid_category",
        repoUrl: "https://github.com/owner/repo",
      })
    );

    expect(result.error).toBeTruthy();
  });

  it("creates problem and redirects on valid input", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockCreateProblem.mockResolvedValue({ id: "problem-1" });

    await expect(
      createProblemAction(
        { error: null },
        makeFormData({
          title: "Clean Water Initiative",
          description: "A project to provide clean water access",
          category: "clean_water",
          repoUrl: "https://github.com/owner/clean-water",
          tags: "water, purification, access",
        })
      )
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(mockCreateProblem).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Clean Water Initiative",
        description: "A project to provide clean water access",
        category: "clean_water",
        repoUrl: "https://github.com/owner/clean-water",
        tags: ["water", "purification", "access"],
        createdBy: "citizen-1",
      })
    );
    expect(mockRedirect).toHaveBeenCalledWith("/problems/problem-1");
  });

  it("passes empty tags array when tags field is empty string", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockCreateProblem.mockResolvedValue({ id: "problem-2" });

    await expect(
      createProblemAction(
        { error: null },
        makeFormData({
          title: "Education Platform",
          description: "A platform for education access",
          category: "education",
          repoUrl: "https://github.com/owner/edu-platform",
          tags: "",
        })
      )
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(mockCreateProblem).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: [],
      })
    );
  });
});
