"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ZDropdown } from "@/components/zephyr/z-dropdown";
import { McpSetupModal, hasCompletedSetup, type Tool } from "./mcp-setup-modal";

interface AgentActionsProps {
  issueId: string;
  issueTitle: string;
  issueDescription: string;
  projectName: string;
  projectSlug: string;
  repoUrl: string | null;
  hasApiKeys?: boolean;
  cliInstalled?: boolean;
}

// SVG paths from Simple Icons (MIT licensed)
function ClaudeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Claude">
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

function CursorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Cursor">
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  );
}

function VSCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="VS Code">
      <path d="M23.15 2.587L18.21.21a1.516 1.516 0 0 0-1.706.29L6.881 9.762 2.857 6.738a1.009 1.009 0 0 0-1.29.05L.235 8.068a1.01 1.01 0 0 0 0 1.47l3.527 3.212L.235 15.963a1.01 1.01 0 0 0 0 1.47l1.332 1.28a1.009 1.009 0 0 0 1.29.05l4.024-3.025 9.623 9.262a1.516 1.516 0 0 0 1.706.291l4.94-2.377A1.517 1.517 0 0 0 24 21.512V3.49a1.517 1.517 0 0 0-.85-1.403M18.002 16.78l-6.635-5.03 6.635-5.03Z" />
    </svg>
  );
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Terminal">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

const PREFERRED_TOOL_KEY = "citizen-preferred-tool";

function getPreferredTool(): Tool | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(PREFERRED_TOOL_KEY);
  if (stored && ["claude-code", "cursor", "opencode", "vscode"].includes(stored)) {
    return stored as Tool;
  }
  return null;
}

function setPreferredTool(tool: Tool) {
  localStorage.setItem(PREFERRED_TOOL_KEY, tool);
}

function buildMcpPrompt(issueId: string, projectSlug: string): string {
  return `Use the Citizen MCP server to work on issue ${issueId} in project "${projectSlug}".

1. Call get_issue with issueId "${issueId}" to read the full context.
2. Call assign_issue to claim it (use your preferred agent name).
3. Clone the repository, create a branch, and solve the issue.
4. Commit your changes, push the branch, and open a pull request.
5. Call submit_contribution with your PR URL to complete the task.`;
}

function shellEscape(str: string): string {
  return "'" + str.replace(/'/g, "'\\''") + "'";
}

function buildCitizenProtocolUrl(
  issueId: string,
  projectSlug: string,
  tool: string,
  repoUrl: string | null,
): string {
  const params = new URLSearchParams({
    issue: issueId,
    project: projectSlug,
    tool,
  });
  if (repoUrl) params.set("repo", repoUrl);
  return `citizen://work?${params.toString()}`;
}

function buildCursorDeepLink(issueId: string, projectSlug: string): string {
  const prompt = buildMcpPrompt(issueId, projectSlug);
  return `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(prompt)}`;
}

function buildFallbackCommand(tool: Tool, issueId: string, projectSlug: string): string {
  const prompt = buildMcpPrompt(issueId, projectSlug);
  switch (tool) {
    case "claude-code":
      return `claude -p ${shellEscape(prompt)}`;
    case "opencode":
      return `opencode -p ${shellEscape(prompt)}`;
    default:
      return prompt;
  }
}

function buildStaticContext({
  issueTitle,
  issueDescription,
  projectName,
  repoUrl,
}: Pick<AgentActionsProps, "issueTitle" | "issueDescription" | "projectName" | "repoUrl">) {
  const parts = [
    `## Issue: ${issueTitle}`,
    "",
    `**Project:** ${projectName}`,
  ];
  if (repoUrl) {
    parts.push(`**Repository:** ${repoUrl}`);
  }
  parts.push(
    "",
    "### Description",
    "",
    issueDescription,
    "",
    "### Instructions",
    "",
    "Solve this issue by making the necessary code changes. When complete:",
    "1. Create a new branch with a descriptive name",
    "2. Commit your changes with a clear commit message",
    "3. Push and open a pull request",
  );
  return parts.join("\n");
}

interface ToolDef {
  id: Tool;
  label: string;
  icon: typeof ClaudeIcon;
  mcpCapable: true;
}

interface BrowserToolDef {
  id: string;
  label: string;
  mcpCapable: false;
}

const MCP_TOOLS: ToolDef[] = [
  { id: "claude-code", label: "Claude Code", icon: ClaudeIcon, mcpCapable: true },
  { id: "cursor", label: "Cursor", icon: CursorIcon, mcpCapable: true },
  { id: "opencode", label: "OpenCode", icon: TerminalIcon, mcpCapable: true },
  { id: "vscode", label: "VS Code", icon: VSCodeIcon, mcpCapable: true },
];

const BROWSER_TOOLS: BrowserToolDef[] = [
  { id: "claude-browser", label: "Claude (Browser)", mcpCapable: false },
  { id: "chatgpt", label: "ChatGPT", mcpCapable: false },
];

export function AgentActions(props: AgentActionsProps) {
  const { showToast } = useToast();
  const [preferredTool, setPreferred] = useState<Tool | null>(null);
  const [setupModal, setSetupModal] = useState<{ open: boolean; tool: Tool }>({
    open: false,
    tool: "claude-code",
  });

  useEffect(() => {
    setPreferred(getPreferredTool());
  }, []);

  async function copyToClipboard(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(message, "success");
    } catch {
      showToast("Failed to copy. Check clipboard permissions", "error");
    }
  }

  function handleMcpTool(tool: Tool) {
    setPreferredTool(tool);
    setPreferred(tool);

    if (!hasCompletedSetup(tool)) {
      setSetupModal({ open: true, tool });
      return;
    }

    launchTool(tool);
  }

  function launchTool(tool: Tool) {
    const { issueId, projectSlug, repoUrl } = props;

    if (props.cliInstalled) {
      // CLI is registered in the DB. Open citizen:// directly.
      const citizenUrl = buildCitizenProtocolUrl(issueId, projectSlug, tool, repoUrl);
      window.location.href = citizenUrl;
      showToast(`Launching ${MCP_TOOLS.find((t) => t.id === tool)?.label ?? tool}...`, "success");
      return;
    }

    // No CLI installed. Use tool-specific fallbacks.
    switch (tool) {
      case "cursor":
        window.open(buildCursorDeepLink(issueId, projectSlug), "_self");
        break;
      case "vscode":
        if (repoUrl) {
          window.open(`vscode://vscode.git/clone?url=${encodeURIComponent(repoUrl)}`, "_self");
        }
        copyToClipboard(
          buildMcpPrompt(issueId, projectSlug),
          "MCP prompt copied. Paste into Copilot chat in VS Code. For one-click launch, run: npx @citizen/cli setup --key <your-key>",
        );
        break;
      default:
        copyToClipboard(
          buildFallbackCommand(tool, issueId, projectSlug),
          "Command copied. For one-click launch, run: npx @citizen/cli setup --key <your-key>",
        );
    }
  }

  async function handleBrowserTool(toolId: string) {
    const context = buildStaticContext(props);

    if (toolId === "claude-browser") {
      await copyToClipboard(context, "Context copied. Paste it into Claude");
      window.open("https://claude.ai/new", "_blank");
    } else if (toolId === "chatgpt") {
      await copyToClipboard(context, "Context copied. Paste it into ChatGPT");
      window.open("https://chat.openai.com/", "_blank");
    }
  }

  function handleCopyMcpPrompt() {
    const prompt = buildMcpPrompt(props.issueId, props.projectSlug);
    copyToClipboard(prompt, "MCP prompt copied to clipboard");
  }

  const preferred = preferredTool
    ? MCP_TOOLS.find((t) => t.id === preferredTool)
    : null;
  const otherMcpTools = MCP_TOOLS.filter((t) => t.id !== preferredTool);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {preferred && (
          <Button size="sm" onClick={() => handleMcpTool(preferred.id)}>
            <preferred.icon className="mr-1.5 h-4 w-4" />
            {preferred.label}
          </Button>
        )}

        <ZDropdown
          trigger={
            <Button size="sm" variant={preferred ? "secondary" : "primary"}>
              {preferred ? "Other Agents" : "Code Agents"}
            </Button>
          }
        >
          {(preferred ? otherMcpTools : MCP_TOOLS).map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleMcpTool(tool.id)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-citizen-sand hover:bg-citizen-muted hover:text-citizen-text transition-colors"
            >
              <tool.icon className="h-4 w-4" />
              {tool.label}
            </button>
          ))}
          <div className="my-1 border-t border-citizen-border" />
          <button
            onClick={handleCopyMcpPrompt}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-citizen-text-dim hover:bg-citizen-muted hover:text-citizen-text transition-colors"
          >
            Copy MCP Prompt
          </button>
        </ZDropdown>

        <ZDropdown
          trigger={
            <Button size="sm" variant="secondary">
              Browser Agents
            </Button>
          }
        >
          {BROWSER_TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleBrowserTool(tool.id)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-citizen-sand hover:bg-citizen-muted hover:text-citizen-text transition-colors"
            >
              {tool.label}
            </button>
          ))}
          <div className="my-1 border-t border-citizen-border" />
          <button
            onClick={() => copyToClipboard(buildStaticContext(props), "Issue context copied to clipboard")}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-citizen-text-dim hover:bg-citizen-muted hover:text-citizen-text transition-colors"
          >
            Copy Context
          </button>
        </ZDropdown>
      </div>

      <McpSetupModal
        open={setupModal.open}
        onClose={() => setSetupModal((s) => ({ ...s, open: false }))}
        tool={setupModal.tool}
        hasApiKeys={props.hasApiKeys ?? false}
      />
    </>
  );
}
