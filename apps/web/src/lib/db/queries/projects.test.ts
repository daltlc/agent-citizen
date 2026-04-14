import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: (...args: unknown[]) => {
      mockSelect(...args);
      return { from: mockFrom };
    },
  },
}));

mockFrom.mockReturnValue({ where: mockWhere });
mockWhere.mockReturnValue({ limit: mockLimit });

import { generateUniqueSlug } from "./projects";

beforeEach(() => {
  vi.clearAllMocks();
  mockFrom.mockReturnValue({ where: mockWhere });
  mockWhere.mockReturnValue({ limit: mockLimit });
});

describe("generateUniqueSlug", () => {
  it("returns a slugified name when no collision exists", async () => {
    mockLimit.mockResolvedValueOnce([]);

    const slug = await generateUniqueSlug("My Project");

    expect(slug).toBe("my-project");
  });

  it("appends a suffix when slug already exists", async () => {
    mockLimit.mockResolvedValueOnce([{ slug: "my-project" }]);

    const slug = await generateUniqueSlug("My Project");

    expect(slug).toMatch(/^my-project-[a-z0-9]{4}$/);
  });

  it("strips special characters and normalizes", async () => {
    mockLimit.mockResolvedValueOnce([]);

    const slug = await generateUniqueSlug("  Hello, World!! @#$  ");

    expect(slug).toBe("hello-world");
  });
});
