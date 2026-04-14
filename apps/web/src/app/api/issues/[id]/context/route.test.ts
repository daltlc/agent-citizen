import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockGetIssueById = vi.fn();
const mockGetProjectById = vi.fn();

vi.mock("@/lib/db/queries/issues", () => ({
  getIssueById: (...args: unknown[]) => mockGetIssueById(...args),
}));
vi.mock("@/lib/db/queries/projects", () => ({
  getProjectById: (...args: unknown[]) => mockGetProjectById(...args),
}));

import { GET } from "./route";

const issue = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Fix water sensor calibration",
  description: "The sensor readings drift after 24 hours. Recalibrate the offset.",
  difficulty: "intermediate",
  status: "assigned",
  projectId: "project-1",
};

const project = {
  id: "project-1",
  name: "AquaMonitor",
  slug: "aquamonitor",
  repoUrl: "https://github.com/example/aquamonitor",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/issues/[id]/context", () => {
  it("returns 400 for invalid UUID", async () => {
    const req = new NextRequest("http://localhost:3000/api/issues/not-a-uuid/context");
    const res = await GET(req, { params: { id: "not-a-uuid" } });
    expect(res.status).toBe(400);
  });

  it("returns 404 when issue does not exist", async () => {
    mockGetIssueById.mockResolvedValue(null);
    const id = "550e8400-e29b-41d4-a716-446655440000";
    const req = new NextRequest(`http://localhost:3000/api/issues/${id}/context`);
    const res = await GET(req, { params: { id } });
    expect(res.status).toBe(404);
  });

  it("returns plain text context by default", async () => {
    mockGetIssueById.mockResolvedValue(issue);
    mockGetProjectById.mockResolvedValue(project);

    const req = new NextRequest(`http://localhost:3000/api/issues/${issue.id}/context`);
    const res = await GET(req, { params: { id: issue.id } });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");

    const text = await res.text();
    expect(text).toContain("Fix water sensor calibration");
    expect(text).toContain("AquaMonitor");
    expect(text).toContain("https://github.com/example/aquamonitor");
  });

  it("returns JSON when format=json", async () => {
    mockGetIssueById.mockResolvedValue(issue);
    mockGetProjectById.mockResolvedValue(project);

    const req = new NextRequest(`http://localhost:3000/api/issues/${issue.id}/context?format=json`);
    const res = await GET(req, { params: { id: issue.id } });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.title).toBe("Fix water sensor calibration");
    expect(json.projectName).toBe("AquaMonitor");
    expect(json.repoUrl).toBe("https://github.com/example/aquamonitor");
  });

  it("handles missing project gracefully", async () => {
    mockGetIssueById.mockResolvedValue(issue);
    mockGetProjectById.mockResolvedValue(null);

    const req = new NextRequest(`http://localhost:3000/api/issues/${issue.id}/context?format=json`);
    const res = await GET(req, { params: { id: issue.id } });

    const json = await res.json();
    expect(json.projectName).toBeNull();
    expect(json.repoUrl).toBeNull();
  });
});
