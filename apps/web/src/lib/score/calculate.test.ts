import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module before importing the function under test
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockInnerJoin = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();
const mockUpdate = vi.fn();
const mockSet = vi.fn();
const mockUpdateWhere = vi.fn();

// Build a chainable object that supports any order of where/orderBy/innerJoin/limit
function makeChainable(resolve?: unknown) {
  const chain: Record<string, (...args: unknown[]) => Record<string, unknown>> = {};
  chain.innerJoin = (...args: unknown[]) => { mockInnerJoin(...args); return chain; };
  chain.where = (...args: unknown[]) => { mockWhere(...args); return chain; };
  chain.orderBy = (...args: unknown[]) => { mockOrderBy(...args); return chain; };
  chain.limit = (...args: unknown[]) => { mockLimit(...args); return chain; };
  // Make it thenable so await resolves to the mock value
  chain.then = (onFulfilled: (v: unknown) => unknown) => Promise.resolve(resolve).then(onFulfilled);
  return chain;
}

vi.mock("@/lib/db", () => ({
  db: {
    select: (...args: unknown[]) => {
      mockSelect(...args);
      return { from: mockFrom };
    },
    update: (...args: unknown[]) => {
      mockUpdate(...args);
      return { set: mockSet };
    },
  },
}));

mockSet.mockReturnValue({ where: mockUpdateWhere });

import { recalculateCitizenScore } from "./calculate";

beforeEach(() => {
  vi.clearAllMocks();
  mockSet.mockReturnValue({ where: mockUpdateWhere });
});

describe("recalculateCitizenScore", () => {
  it("calculates score with difficulty multiplier, diversity, and streak bonuses", async () => {
    // Main query returns accepted contributions with difficulty/category
    mockFrom.mockReturnValueOnce(
      makeChainable([
        {
          id: "c1",
          status: "accepted",
          impactScore: null,
          submittedAt: new Date("2026-01-01"),
          projectId: "p1",
          difficulty: "intermediate",
          category: "humanitarian",
        },
        {
          id: "c2",
          status: "accepted",
          impactScore: null,
          submittedAt: new Date("2026-01-02"),
          projectId: "p1",
          difficulty: "beginner",
          category: "environment",
        },
      ])
    );

    // First-responder check for project p1
    mockFrom.mockReturnValueOnce(makeChainable([{ citizenId: "citizen-123" }]));

    // Impact score updates + final score update
    mockUpdateWhere.mockResolvedValue(undefined);

    const score = await recalculateCitizenScore("citizen-123");

    // base: (10*2) + (10*1) = 30
    // diversity: 2 categories * 5 = 10
    // first responder: 1 project * 5 = 5
    // streak: (1*2) + (2*2) = 6
    // total: 30 + 10 + 5 + 6 = 51
    expect(score).toBe(51);
  });

  it("returns 0 when no contributions", async () => {
    // Main query returns empty array
    mockFrom.mockReturnValueOnce(makeChainable([]));
    mockUpdateWhere.mockResolvedValueOnce(undefined);

    const score = await recalculateCitizenScore("citizen-456");

    expect(score).toBe(0);
  });

  it("handles only pending contributions as zero score", async () => {
    mockFrom.mockReturnValueOnce(
      makeChainable([
        {
          id: "c1",
          status: "pending",
          impactScore: null,
          submittedAt: new Date("2026-01-01"),
          projectId: "p1",
          difficulty: "beginner",
          category: "humanitarian",
        },
      ])
    );
    mockUpdateWhere.mockResolvedValueOnce(undefined);

    const score = await recalculateCitizenScore("citizen-789");

    // No accepted contributions, so base/diversity/first-responder/streak all 0
    expect(score).toBe(0);
  });
});
