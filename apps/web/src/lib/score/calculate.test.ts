import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module before importing the function under test
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockUpdate = vi.fn();
const mockSet = vi.fn();
const mockUpdateWhere = vi.fn();

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

// Make from() return { where: mockWhere }
mockFrom.mockReturnValue({ where: mockWhere });
// Make set() return { where: mockUpdateWhere }
mockSet.mockReturnValue({ where: mockUpdateWhere });

import { recalculateCitizenScore } from "./calculate";

beforeEach(() => {
  vi.clearAllMocks();
  mockFrom.mockReturnValue({ where: mockWhere });
  mockSet.mockReturnValue({ where: mockUpdateWhere });
});

describe("recalculateCitizenScore", () => {
  it("calculates score as (accepted * 10) + (completed * 5)", async () => {
    // First query: accepted contributions count
    mockWhere.mockResolvedValueOnce([{ acceptedContributions: 3 }]);
    // Second query: completed issues count
    mockWhere.mockResolvedValueOnce([{ completedIssues: 2 }]);
    mockUpdateWhere.mockResolvedValueOnce(undefined);

    const score = await recalculateCitizenScore("citizen-123");

    expect(score).toBe(40); // 3*10 + 2*5
  });

  it("returns 0 when no contributions or issues", async () => {
    mockWhere.mockResolvedValueOnce([{ acceptedContributions: 0 }]);
    mockWhere.mockResolvedValueOnce([{ completedIssues: 0 }]);
    mockUpdateWhere.mockResolvedValueOnce(undefined);

    const score = await recalculateCitizenScore("citizen-456");

    expect(score).toBe(0);
  });

  it("handles null results gracefully", async () => {
    mockWhere.mockResolvedValueOnce([{}]);
    mockWhere.mockResolvedValueOnce([{}]);
    mockUpdateWhere.mockResolvedValueOnce(undefined);

    const score = await recalculateCitizenScore("citizen-789");

    expect(score).toBe(0);
  });
});
