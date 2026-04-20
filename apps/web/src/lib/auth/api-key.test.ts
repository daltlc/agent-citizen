import { describe, it, expect } from "vitest";
import { createHash } from "crypto";
import { generateApiKey, hashApiKey } from "./api-key";

describe("generateApiKey", () => {
  it("uses the ck_ prefix and is unique per call", () => {
    const a = generateApiKey();
    const b = generateApiKey();
    expect(a).toMatch(/^ck_[0-9a-f]{64}$/);
    expect(b).toMatch(/^ck_[0-9a-f]{64}$/);
    expect(a).not.toBe(b);
  });
});

describe("hashApiKey", () => {
  it("produces a stable SHA-256 hex digest", () => {
    const key = "ck_abcdef";
    const expected = createHash("sha256").update(key).digest("hex");
    expect(hashApiKey(key)).toBe(expected);
    expect(hashApiKey(key)).toHaveLength(64);
  });

  it("never returns the raw key", () => {
    const key = generateApiKey();
    expect(hashApiKey(key)).not.toContain(key);
    expect(hashApiKey(key)).not.toContain(key.slice(3));
  });

  it("is deterministic across calls", () => {
    const key = generateApiKey();
    expect(hashApiKey(key)).toBe(hashApiKey(key));
  });

  it("differs for different inputs", () => {
    expect(hashApiKey("ck_a")).not.toBe(hashApiKey("ck_b"));
  });
});
