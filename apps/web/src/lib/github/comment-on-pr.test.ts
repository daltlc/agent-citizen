import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { commentOnPr } from "./comment-on-pr";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("commentOnPr", () => {
  it("returns false when GITHUB_TOKEN is empty string", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    const result = await commentOnPr(
      "https://github.com/owner/repo/pull/1",
      "test comment"
    );
    expect(result).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns false when GITHUB_TOKEN is undefined", async () => {
    delete process.env.GITHUB_TOKEN;
    const result = await commentOnPr(
      "https://github.com/owner/repo/pull/1",
      "test comment"
    );
    expect(result).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns false for an invalid PR URL", async () => {
    vi.stubEnv("GITHUB_TOKEN", "ghp_test123");
    const result = await commentOnPr("not-a-url", "test comment");
    expect(result).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("calls the GitHub API with correct endpoint and headers", async () => {
    vi.stubEnv("GITHUB_TOKEN", "ghp_test123");
    fetchMock.mockResolvedValue({ ok: true });

    await commentOnPr(
      "https://github.com/myorg/myrepo/pull/42",
      "Looks good!"
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/myorg/myrepo/issues/42/comments",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer ghp_test123",
          Accept: "application/vnd.github+json",
        }),
        body: JSON.stringify({ body: "Looks good!" }),
      })
    );
  });

  it("returns true when the API responds successfully", async () => {
    vi.stubEnv("GITHUB_TOKEN", "ghp_test123");
    fetchMock.mockResolvedValue({ ok: true });

    const result = await commentOnPr(
      "https://github.com/owner/repo/pull/1",
      "comment"
    );
    expect(result).toBe(true);
  });

  it("returns false when the API responds with an error", async () => {
    vi.stubEnv("GITHUB_TOKEN", "ghp_test123");
    fetchMock.mockResolvedValue({ ok: false, status: 403 });

    const result = await commentOnPr(
      "https://github.com/owner/repo/pull/1",
      "comment"
    );
    expect(result).toBe(false);
  });

  it("returns false when fetch throws", async () => {
    vi.stubEnv("GITHUB_TOKEN", "ghp_test123");
    fetchMock.mockRejectedValue(new Error("Network error"));

    const result = await commentOnPr(
      "https://github.com/owner/repo/pull/1",
      "comment"
    );
    expect(result).toBe(false);
  });
});
