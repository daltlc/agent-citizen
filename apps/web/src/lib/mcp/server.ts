import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getProblems, getProblemById } from "@/lib/db/queries/problems";
import {
  getProjects,
  getProjectBySlug,
} from "@/lib/db/queries/projects";
import {
  getIssuesByProjectId,
  getIssueById,
  assignIssue,
  unassignIssue,
  updateIssueStatus,
} from "@/lib/db/queries/issues";
import { createContribution } from "@/lib/db/queries/contributions";
import {
  getCitizenByUsername,
  getCitizenActiveAssignments,
  getCitizenContributions,
  getTopCitizens,
} from "@/lib/db/queries/citizens";
import { getPlatformStats } from "@/lib/db/queries/stats";
import { SDG_CATEGORIES } from "@/types/enums";

type Citizen = {
  id: string;
  githubId: string;
  username: string;
  avatarUrl: string | null;
  citizenScore: number;
  bio: string | null;
  joinedAt: Date;
};

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function jsonResult(data: unknown) {
  return textResult(JSON.stringify(data, null, 2));
}

function errorResult(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

/**
 * Registers all Citizen MCP tools on the given server instance.
 * `getCitizen` is a function that returns the authenticated citizen (or null)
 * from the current request context.
 */
export function registerTools(
  server: McpServer,
  getCitizen: () => Citizen | null
) {
  // ── Read Tools (no auth required) ──────────────────────────────

  server.tool(
    "list_problems",
    "List problems (real-world causes) on the Citizen platform, optionally filtered by UN SDG category.",
    {
      category: z
        .enum(SDG_CATEGORIES)
        .optional()
        .describe("Filter by SDG category"),
    },
    async ({ category }) => {
      const problems = await getProblems(category);
      return jsonResult(problems);
    }
  );

  server.tool(
    "get_problem",
    "Get details of a specific problem by ID.",
    { id: z.string().uuid().describe("Problem ID") },
    async ({ id }) => {
      const problem = await getProblemById(id);
      if (!problem) return errorResult("Problem not found.");
      return jsonResult(problem);
    }
  );

  server.tool(
    "list_projects",
    "List public projects on the Citizen platform, optionally filtered by SDG category.",
    {
      category: z
        .enum(SDG_CATEGORIES)
        .optional()
        .describe("Filter by problem category"),
    },
    async ({ category }) => {
      const projects = await getProjects(category);
      return jsonResult(projects);
    }
  );

  server.tool(
    "get_project",
    "Get details of a specific project by its slug.",
    { slug: z.string().describe("Project slug") },
    async ({ slug }) => {
      const project = await getProjectBySlug(slug);
      if (!project) return errorResult("Project not found.");
      return jsonResult(project);
    }
  );

  server.tool(
    "list_issues",
    "List issues for a project. Returns issue title, status, difficulty, and assignee info.",
    {
      projectSlug: z.string().describe("Project slug"),
      status: z
        .enum([
          "open",
          "assigned",
          "in_progress",
          "in_review",
          "completed",
          "closed",
        ])
        .optional()
        .describe("Filter by issue status"),
      difficulty: z
        .enum(["beginner", "intermediate", "advanced"])
        .optional()
        .describe("Filter by difficulty"),
    },
    async ({ projectSlug, status, difficulty }) => {
      const project = await getProjectBySlug(projectSlug);
      if (!project) return errorResult("Project not found.");

      let issues = await getIssuesByProjectId(project.id);

      if (status) {
        issues = issues.filter((i) => i.status === status);
      }
      if (difficulty) {
        issues = issues.filter((i) => i.difficulty === difficulty);
      }

      return jsonResult(issues);
    }
  );

  server.tool(
    "get_issue",
    "Get full details of a specific issue, including description, difficulty, status, and assignee.",
    { id: z.string().uuid().describe("Issue ID") },
    async ({ id }) => {
      const issue = await getIssueById(id);
      if (!issue) return errorResult("Issue not found.");
      return jsonResult(issue);
    }
  );

  server.tool(
    "get_citizen",
    "Get a citizen's public profile by username.",
    { username: z.string().describe("Citizen username") },
    async ({ username }) => {
      const citizen = await getCitizenByUsername(username);
      if (!citizen) return errorResult("Citizen not found.");
      return jsonResult(citizen);
    }
  );

  server.tool(
    "get_leaderboard",
    "Get the top citizens by Citizen Score.",
    {
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("Number of citizens to return (default 10)"),
    },
    async ({ limit }) => {
      const top = await getTopCitizens(limit ?? 10);
      return jsonResult(top);
    }
  );

  server.tool(
    "get_platform_stats",
    "Get platform-wide statistics: total problems, projects, issues, citizens, contributions, and open issues.",
    async () => {
      const stats = await getPlatformStats();
      return jsonResult(stats);
    }
  );

  // ── Write Tools (auth required) ────────────────────────────────

  server.tool(
    "assign_issue",
    "Claim an open issue to work on. Requires authentication via API key. Only open issues can be assigned.",
    {
      issueId: z.string().uuid().describe("Issue ID to claim"),
      agentName: z
        .string()
        .max(50)
        .optional()
        .describe(
          "Name of the AI agent working on this (e.g. 'Claude Code')"
        ),
    },
    async ({ issueId, agentName }) => {
      const citizen = getCitizen();
      if (!citizen)
        return errorResult(
          "Authentication required. Provide an API key via Authorization header."
        );

      const issue = await getIssueById(issueId);
      if (!issue) return errorResult("Issue not found.");
      if (issue.status !== "open")
        return errorResult(
          `Issue is not open (current status: ${issue.status}).`
        );

      const updated = await assignIssue(issueId, citizen.id, agentName);
      return jsonResult({
        message: "Issue assigned successfully.",
        issue: updated,
      });
    }
  );

  server.tool(
    "unassign_issue",
    "Drop a claimed issue. Only the assigned citizen can unassign. Issue must be in 'assigned' or 'in_progress' status.",
    { issueId: z.string().uuid().describe("Issue ID to unassign") },
    async ({ issueId }) => {
      const citizen = getCitizen();
      if (!citizen)
        return errorResult(
          "Authentication required. Provide an API key via Authorization header."
        );

      const issue = await getIssueById(issueId);
      if (!issue) return errorResult("Issue not found.");
      if (issue.assignedTo?.id !== citizen.id)
        return errorResult("You are not assigned to this issue.");
      if (issue.status !== "assigned" && issue.status !== "in_progress") {
        return errorResult(
          `Cannot unassign issue with status '${issue.status}'.`
        );
      }

      const updated = await unassignIssue(issueId);
      return jsonResult({ message: "Issue unassigned.", issue: updated });
    }
  );

  server.tool(
    "submit_contribution",
    "Submit a pull request URL as a contribution for an issue you are assigned to. The project owner will review it.",
    {
      issueId: z.string().uuid().describe("Issue ID"),
      prUrl: z.string().url().describe("Pull request URL (e.g. GitHub PR)"),
    },
    async ({ issueId, prUrl }) => {
      const citizen = getCitizen();
      if (!citizen)
        return errorResult(
          "Authentication required. Provide an API key via Authorization header."
        );

      const issue = await getIssueById(issueId);
      if (!issue) return errorResult("Issue not found.");
      if (issue.assignedTo?.id !== citizen.id)
        return errorResult("You are not assigned to this issue.");

      const contribution = await createContribution({
        issueId,
        projectId: issue.projectId,
        citizenId: citizen.id,
        externalRef: prUrl,
      });

      await updateIssueStatus(issueId, "in_review");

      return jsonResult({
        message: "Contribution submitted for review.",
        contribution,
      });
    }
  );

  server.tool(
    "my_profile",
    "Get your own citizen profile and score. Requires authentication via API key.",
    async () => {
      const citizen = getCitizen();
      if (!citizen)
        return errorResult(
          "Authentication required. Provide an API key via Authorization header."
        );
      return jsonResult(citizen);
    }
  );

  server.tool(
    "my_assignments",
    "List issues currently assigned to you. Requires authentication via API key.",
    async () => {
      const citizen = getCitizen();
      if (!citizen)
        return errorResult(
          "Authentication required. Provide an API key via Authorization header."
        );

      const assignments = await getCitizenActiveAssignments(citizen.id);
      return jsonResult(assignments);
    }
  );

  server.tool(
    "my_contributions",
    "List all your contributions and their review status. Requires authentication via API key.",
    async () => {
      const citizen = getCitizen();
      if (!citizen)
        return errorResult(
          "Authentication required. Provide an API key via Authorization header."
        );

      const contributions = await getCitizenContributions(citizen.id);
      return jsonResult(contributions);
    }
  );
}
