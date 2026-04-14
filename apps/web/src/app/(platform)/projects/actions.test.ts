import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetCurrentCitizen = vi.fn();
const mockCreateProject = vi.fn();
const mockGenerateUniqueSlug = vi.fn();
const mockRedirect = vi.fn();

vi.mock("@/lib/auth/get-citizen", () => ({
  getCurrentCitizen: () => mockGetCurrentCitizen(),
}));
vi.mock("@/lib/db/queries/projects", () => ({
  createProject: (...args: unknown[]) => mockCreateProject(...args),
  generateUniqueSlug: (...args: unknown[]) => mockGenerateUniqueSlug(...args),
}));
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args);
    throw new Error("NEXT_REDIRECT");
  },
}));

import { createProjectAction } from "./actions";

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

const citizen = { id: "citizen-1", username: "testuser" };
const validUUID = "550e8400-e29b-41d4-a716-446655440000";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createProjectAction", () => {
  it("returns error when not signed in", async () => {
    mockGetCurrentCitizen.mockResolvedValue(null);

    const result = await createProjectAction(
      { error: null },
      makeFormData({
        problemId: validUUID,
        name: "Test Project",
        description: "A valid project description",
      })
    );

    expect(result.error).toBe("Must be signed in to create a project");
  });

  it("returns validation error for name too short", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);

    const result = await createProjectAction(
      { error: null },
      makeFormData({
        problemId: validUUID,
        name: "X",
        description: "A valid project description",
      })
    );

    expect(result.error).toBeTruthy();
  });

  it("creates project with slug and redirects on valid input", async () => {
    mockGetCurrentCitizen.mockResolvedValue(citizen);
    mockGenerateUniqueSlug.mockResolvedValue("test-project");
    mockCreateProject.mockResolvedValue({ slug: "test-project" });

    await expect(
      createProjectAction(
        { error: null },
        makeFormData({
          problemId: validUUID,
          name: "Test Project",
          description: "A valid project description here",
          repoUrl: "",
        })
      )
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(mockGenerateUniqueSlug).toHaveBeenCalledWith("Test Project");
    expect(mockCreateProject).toHaveBeenCalledWith(
      expect.objectContaining({
        problemId: validUUID,
        name: "Test Project",
        slug: "test-project",
        description: "A valid project description here",
        ownerId: "citizen-1",
      })
    );
    expect(mockRedirect).toHaveBeenCalledWith("/projects/test-project");
  });
});
