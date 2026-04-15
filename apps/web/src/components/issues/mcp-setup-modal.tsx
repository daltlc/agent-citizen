"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type Tool = "claude-code" | "cursor" | "opencode" | "vscode";

const TOOL_LABELS: Record<Tool, string> = {
  "claude-code": "Claude Code",
  cursor: "Cursor",
  opencode: "OpenCode",
  vscode: "VS Code (Copilot)",
};

const TOOL_CONFIG_PATHS: Record<Tool, string> = {
  "claude-code": "~/.claude.json (global) or .mcp.json (per-project)",
  cursor: "Cursor Settings > MCP Servers > Add Server",
  opencode: "opencode.json in your project root",
  vscode: ".vscode/mcp.json in your project root",
};

const KEY_PLACEHOLDER = "YOUR_API_KEY";

function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

function buildMcpConfig(apiKey: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        citizen: {
          type: "url",
          url: `${getBaseUrl()}/api/mcp`,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      },
    },
    null,
    2
  );
}

function buildVsCodeConfig(apiKey: string): string {
  return JSON.stringify(
    {
      servers: {
        citizen: {
          type: "http",
          url: `${getBaseUrl()}/api/mcp`,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      },
    },
    null,
    2
  );
}

function getConfigForTool(tool: Tool, apiKey: string): string {
  if (tool === "vscode") return buildVsCodeConfig(apiKey);
  return buildMcpConfig(apiKey);
}

interface McpSetupModalProps {
  open: boolean;
  onClose: () => void;
  tool: Tool;
  hasApiKeys: boolean;
}

export function McpSetupModal({
  open,
  onClose,
  tool,
  hasApiKeys,
}: McpSetupModalProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<"key" | "config" | "done">(
    hasApiKeys ? "config" : "key"
  );

  function handleCopyConfig() {
    const config = getConfigForTool(tool, KEY_PLACEHOLDER);
    navigator.clipboard.writeText(config).then(
      () => showToast("Config copied. Replace YOUR_API_KEY with your key from the dashboard", "success"),
      () => showToast("Failed to copy", "error")
    );
  }

  function handleDone() {
    localStorage.setItem(`citizen-mcp-setup-${tool}`, "true");
    setStep("done");
  }

  function handleClose() {
    setStep(hasApiKeys ? "config" : "key");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Connect ${TOOL_LABELS[tool]}`}>
      {step === "key" && (
        <div className="space-y-4">
          <p className="text-sm text-citizen-sand">
            To connect {TOOL_LABELS[tool]} to Citizen, you need an API key.
            Create one from your dashboard first.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => window.open("/dashboard/api-keys", "_blank")}
            >
              Open API Keys Dashboard
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setStep("config")}>
              I already have one
            </Button>
          </div>
        </div>
      )}

      {step === "config" && (
        <div className="space-y-4">
          <p className="text-sm text-citizen-sand">
            Add this config to {TOOL_LABELS[tool]}, replacing{" "}
            <code className="rounded bg-citizen-muted px-1 py-0.5 text-xs">YOUR_API_KEY</code>{" "}
            with your Citizen API key:
          </p>
          <p className="text-xs text-citizen-text-dim">
            Paste into:{" "}
            <code className="rounded bg-citizen-muted px-1 py-0.5">{TOOL_CONFIG_PATHS[tool]}</code>
          </p>
          <div className="relative">
            <pre className="max-h-64 overflow-auto rounded-md border border-citizen-border bg-citizen-muted p-3 text-xs text-citizen-text">
              {getConfigForTool(tool, KEY_PLACEHOLDER)}
            </pre>
            <button
              onClick={handleCopyConfig}
              className="absolute right-2 top-2 rounded border border-citizen-border bg-citizen-elevated px-2 py-1 text-xs text-citizen-text-dim hover:text-citizen-text transition-colors"
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-citizen-text-dim">
            Don't have a key?{" "}
            <button
              onClick={() => window.open("/dashboard/api-keys", "_blank")}
              className="text-citizen-accent hover:underline"
            >
              Create one on your dashboard
            </button>
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleDone}>
              Done - I've added it
            </Button>
            <Button size="sm" variant="secondary" onClick={handleClose}>
              I'll do this later
            </Button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="space-y-4">
          <p className="text-sm text-citizen-sand">
            You're all set. Click the {TOOL_LABELS[tool]} button on any issue to start working.
            Your agent will connect to Citizen's MCP server and can assign itself,
            read issue context, and submit contributions automatically.
          </p>
          <div className="rounded-md border border-citizen-border bg-citizen-muted p-3">
            <p className="text-xs font-medium text-citizen-text">
              Want one-click launch?
            </p>
            <p className="mt-1 text-xs text-citizen-text-dim">
              Install the Citizen CLI so clicking the button opens your tool directly
              instead of copying commands:
            </p>
            <code className="mt-2 block rounded bg-citizen-elevated px-2 py-1 text-xs text-citizen-accent">
              npx @citizen/cli setup
            </code>
          </div>
          <Button size="sm" onClick={handleClose}>
            Got it
          </Button>
        </div>
      )}
    </Modal>
  );
}

export function hasCompletedSetup(tool: Tool): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`citizen-mcp-setup-${tool}`) === "true";
}

export type { Tool };
