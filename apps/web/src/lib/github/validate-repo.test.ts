import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseRepoUrl, verifyRepoExists } from "./validate-repo";

describe("parseRepoUrl", () => {
  it("parses a valid GitHub repo URL", () => {
    const result = parseRepoUrl("https://github.com/owner/repo");
    expect(result).toEqual({ owner: "owner", repo: "repo" });
  });

  it("parses a URL with trailing slash", () => {
    const result = parseRepoUrl("https://github.com/owner/repo/");
    expect(result).toEqual({ owner: "owner", repo: "repo" });
  });

  it("returns null for a non-GitHub hostname", () => {
    expect(parseRepoUrl("https://gitlab.com/owner/repo")).toBeNull();
  });

  it("returns null for too many path segments", () => {
    expect(parseRepoUrl("https://github.com/owner/repo/issues")).toBeNull();
  });

  it("returns null for just an owner (no repo)", () => {
    expect(parseRepoUrl("https://github.com/owner")).toBeNull();
  });

  it("returns null for an invalid URL string", () => {
    expect(parseRepoUrl("not-a-url")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(parseRepoUrl("")).toBeNull();
  });

  it("returns null for a PR URL", () => {
    expect(
      parseRepoUrl("https://github.com/owner/repo/pull/42")
    ).toBeNull();
  });
});

describe("verifyRepoExists", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true when the repo exists (200)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ status: 200 })
    );

    const result = await verifyRepoExists("owner", "repo");
    expect(result).toBe(true);
  });

  it("returns false when the repo does not exist (404)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ status: 404 })
    );

    const result = await verifyRepoExists("owner", "repo");
    expect(result).toBe(false);
  });

  it("returns true (soft pass) on network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    const result = await verifyRepoExists("owner", "repo");
    expect(result).toBe(true);
  });

  it("returns true (soft pass) on rate limit (403)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ status: 403 })
    );

    const result = await verifyRepoExists("owner", "repo");
    expect(result).toBe(true);
  });
});
