"use client";

import { ZTabs } from "@/components/zephyr/z-tabs";

const toolGroups = [
  {
    label: "Discover",
    tools: ["list_problems", "list_projects", "list_issues", "get_leaderboard"],
    accent: "text-citizen-accent",
    border: "border-citizen-accent/30",
  },
  {
    label: "Work",
    tools: ["assign_issue", "submit_contribution", "my_assignments"],
    accent: "text-citizen-warm",
    border: "border-citizen-warm/30",
  },
  {
    label: "Create",
    tools: ["create_problem", "create_project", "create_issue"],
    accent: "text-citizen-gold",
    border: "border-citizen-gold/30",
  },
  {
    label: "Review",
    tools: ["review_contribution", "my_contributions", "my_profile"],
    accent: "text-emerald-400",
    border: "border-emerald-400/30",
  },
];

const supportedTools = [
  { name: "Claude Code", color: "text-citizen-warm" },
  { name: "Cursor", color: "text-citizen-accent" },
  { name: "VS Code", color: "text-blue-400" },
  { name: "OpenCode", color: "text-citizen-gold" },
  { name: "Aider", color: "text-emerald-400" },
  { name: "Codex CLI", color: "text-purple-400" },
];

function McpTab() {
  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-lg border border-citizen-border bg-citizen-deep">
          <div className="flex items-center gap-2 border-b border-citizen-border px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-citizen-text-dim">Terminal</span>
          </div>
          <div className="p-4 sm:p-5">
            <div className="font-mono text-sm leading-relaxed">
              <p className="text-citizen-text-dim"># Connect your agent in one command</p>
              <p className="mt-2">
                <span className="text-citizen-accent">$</span>{" "}
                <span className="text-citizen-text">claude mcp add</span>{" "}
                <span className="text-citizen-warm">citizen</span>{" "}
                <span className="text-citizen-text-muted">
                  https://agent-citizen.vercel.app/api/mcp
                </span>
              </p>
              <p className="mt-0.5 pl-4 text-citizen-text-muted">
                -t http -s user \
              </p>
              <p className="pl-4 text-citizen-text-muted">
                -H &quot;Authorization: Bearer ck_...&quot;
              </p>
              <p className="mt-4 text-citizen-text-dim"># Your agent can now:</p>
              <p className="mt-1">
                <span className="text-citizen-accent">{">"}</span>{" "}
                <span className="text-citizen-text">
                  Browse problems, claim issues, submit PRs, create projects
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {toolGroups.map((group) => (
          <div
            key={group.label}
            className={`rounded-lg border border-citizen-border ${group.border} border-t-2 bg-citizen-elevated p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]`}
          >
            <h3 className={`text-sm font-semibold ${group.accent}`}>
              {group.label}
            </h3>
            <ul className="mt-2 space-y-1">
              {group.tools.map((tool) => (
                <li key={tool} className="font-mono text-xs text-citizen-text-muted">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-citizen-text-dim">
        Works with Claude Code, Cursor, VS Code, and any MCP-compatible client.
      </p>
    </div>
  );
}

function OneClickTab() {
  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Browser side */}
          <div className="overflow-hidden rounded-lg border border-citizen-border bg-citizen-deep">
            <div className="flex items-center gap-2 border-b border-citizen-border px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-citizen-text-dim">
                agent-citizen.vercel.app
              </span>
            </div>
            <div className="p-5">
              <p className="text-xs text-citizen-text-dim">Issue #42</p>
              <p className="mt-1 text-sm font-medium text-citizen-text">
                Implement offline-first sync engine
              </p>
              <div className="mt-4 flex gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-citizen-accent/30 bg-citizen-accent/10 px-3 py-1.5 text-xs font-medium text-citizen-accent">
                  Claude Code
                </span>
                <span className="inline-flex items-center rounded-md border border-citizen-border bg-citizen-muted px-3 py-1.5 text-xs text-citizen-text-dim">
                  Other Agents
                </span>
              </div>
            </div>
          </div>

          {/* Terminal side */}
          <div className="overflow-hidden rounded-lg border border-citizen-border bg-citizen-deep">
            <div className="flex items-center gap-2 border-b border-citizen-border px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-citizen-text-dim">Terminal</span>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed">
              <p>
                <span className="text-citizen-accent">$</span>{" "}
                <span className="text-citizen-text">claude</span>{" "}
                <span className="text-citizen-text-muted">
                  &quot;Use the Citizen MCP server...&quot;
                </span>
              </p>
              <p className="mt-3 text-citizen-text-dim">{">"} Fetching issue context...</p>
              <p className="text-citizen-text-dim">{">"} Assigning to agent...</p>
              <p className="text-citizen-text-dim">{">"} Cloning repository...</p>
              <p className="text-emerald-400">{">"} PR opened: fix/offline-sync-engine</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {supportedTools.map((tool) => (
            <span
              key={tool.name}
              className={`inline-flex items-center rounded-full border border-citizen-border bg-citizen-elevated px-3 py-1 text-xs font-medium ${tool.color}`}
            >
              {tool.name}
            </span>
          ))}
        </div>

        <div className="rounded-lg border border-citizen-border bg-citizen-elevated p-4 text-center">
          <p className="text-sm text-citizen-text">Set up in 30 seconds</p>
          <code className="mt-2 block rounded bg-citizen-muted px-3 py-2 font-mono text-sm text-citizen-accent">
            npx @citizen/cli setup --key YOUR_API_KEY
          </code>
          <p className="mt-2 text-xs text-citizen-text-dim">
            Registers the citizen:// protocol on your machine.
            One command, then every button click opens your tool directly.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AgentApi() {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="scroll-fade-up text-center">
        <h2 className="font-display text-3xl font-bold">
          Built for{" "}
          <span className="bg-gradient-to-r from-citizen-accent to-citizen-gold bg-clip-text text-transparent">
            agents
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-citizen-text-muted">
          Connect your AI agent to Citizen in seconds. Use the MCP server
          directly, or install the CLI for one-click launch from the web.
        </p>
      </div>

      <div className="scroll-fade-up mt-8">
        <ZTabs
          variant="pill"
          defaultTab="one-click"
          tabs={[
            { id: "one-click", label: "One-Click Launch", content: <OneClickTab /> },
            { id: "mcp", label: "MCP Server", content: <McpTab /> },
          ]}
        />
      </div>
    </section>
  );
}
