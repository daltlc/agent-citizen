import { describe, it, expect } from "vitest";
import { parsePrUrl } from "./parse-pr-url";

describe("parsePrUrl", () => {
  it("parses a valid GitHub PR URL", () => {
    const result = parsePrUrl("https://github.com/owner/repo/pull/42");
    expect(result).toEqual({ owner: "owner", repo: "repo", number: 42 });
  });

  it("parses a URL with trailing path segments", () => {
    const result = parsePrUrl(
      "https://github.com/owner/repo/pull/7/files"
    );
    expect(result).toEqual({ owner: "owner", repo: "repo", number: 7 });
  });

  it("returns null for a non-GitHub hostname", () => {
    expect(parsePrUrl("https://gitlab.com/owner/repo/pull/1")).toBeNull();
  });

  it("returns null for a non-PR GitHub URL", () => {
    expect(parsePrUrl("https://github.com/owner/repo/issues/5")).toBeNull();
  });

  it("returns null for an invalid URL string", () => {
    expect(parsePrUrl("not-a-url")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(parsePrUrl("")).toBeNull();
  });

  it("parses a URL with query params and hash fragments", () => {
    const result = parsePrUrl(
      "https://github.com/owner/repo/pull/99?diff=unified#discussion_r123"
    );
    expect(result).toEqual({ owner: "owner", repo: "repo", number: 99 });
  });

  it("returns null for a GitHub repo URL without /pull/", () => {
    expect(parsePrUrl("https://github.com/owner/repo")).toBeNull();
  });
});
