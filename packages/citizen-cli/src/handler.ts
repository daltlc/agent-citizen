#!/usr/bin/env node

import { execSync, spawn } from "node:child_process";
import { readFileSync, existsSync, writeFileSync, unlinkSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

interface ToolConfig {
  command?: string;
  args?: string[];
  deepLink?: string;
  label: string;
}

interface Config {
  tools: Record<string, ToolConfig>;
  defaultTool: string;
}

const CONFIG_DIR = join(homedir(), ".citizen");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

function loadConfig(): Config {
  if (!existsSync(CONFIG_PATH)) {
    console.error("Config not found. Run 'citizen setup' first.");
    process.exit(1);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
}

function shellEscape(str: string): string {
  return "'" + str.replace(/'/g, "'\\''") + "'";
}

function buildMcpPrompt(issueId: string, projectSlug: string): string {
  return [
    `Use the Citizen MCP server to work on issue ${issueId} in project "${projectSlug}".`,
    "",
    `1. Call get_issue with issueId "${issueId}" to read the full context.`,
    "2. Call assign_issue to claim it (use your preferred agent name).",
    "3. Clone the repository, create a branch, and solve the issue.",
    "4. Commit your changes, push the branch, and open a pull request.",
    "5. Call submit_contribution with your PR URL to complete the task.",
  ].join("\n");
}

function spawnInTerminal(command: string, args: string[]) {
  const fullCmd = [command, ...args.map(shellEscape)].join(" ");

  if (process.platform === "darwin") {
    // Write command to a .command file and open it in Terminal.
    // Using `open -a Terminal` avoids Automation permission prompts.
    const scriptPath = join(tmpdir(), `citizen-launch-${Date.now()}.command`);
    const scriptContent = [
      "#!/bin/bash",
      'cd "$HOME"',
      fullCmd,
      `rm -f ${shellEscape(scriptPath)}`,
      "",
    ].join("\n");
    writeFileSync(scriptPath, scriptContent, { mode: 0o755 });
    execSync(`open -a Terminal ${shellEscape(scriptPath)}`);
  } else if (process.platform === "linux") {
    const terminals = [
      { cmd: "gnome-terminal", args: ["--", "bash", "-c", fullCmd] },
      { cmd: "konsole", args: ["-e", "bash", "-c", fullCmd] },
      { cmd: "xfce4-terminal", args: ["-e", `bash -c '${fullCmd}'`] },
      { cmd: "xterm", args: ["-e", fullCmd] },
    ];
    for (const term of terminals) {
      try {
        spawn(term.cmd, term.args, { detached: true, stdio: "ignore" });
        return;
      } catch {
        continue;
      }
    }
    console.error("No supported terminal emulator found.");
    process.exit(1);
  } else if (process.platform === "win32") {
    spawn("cmd.exe", ["/c", "start", "cmd.exe", "/k", fullCmd], {
      detached: true,
      stdio: "ignore",
    });
  }
}

function openUrl(url: string) {
  if (process.platform === "darwin") {
    execSync(`open ${shellEscape(url)}`);
  } else if (process.platform === "linux") {
    execSync(`xdg-open ${shellEscape(url)}`);
  } else if (process.platform === "win32") {
    execSync(`start "" ${shellEscape(url)}`);
  }
}

// Main: parse the citizen:// URL and dispatch
const rawUrl = process.argv[2];
if (!rawUrl || !rawUrl.startsWith("citizen://")) {
  console.error("Usage: citizen-handler citizen://work?issue=<id>&project=<slug>&tool=<tool>");
  process.exit(1);
}

const url = new URL(rawUrl);
const issueId = url.searchParams.get("issue");
const projectSlug = url.searchParams.get("project");
const repoUrl = url.searchParams.get("repo");
const toolName = url.searchParams.get("tool");

if (!issueId || !projectSlug) {
  console.error("Missing required params: issue, project");
  process.exit(1);
}

const config = loadConfig();
const resolvedToolName = toolName ?? config.defaultTool;
const tool = config.tools[resolvedToolName];

if (!tool) {
  console.error(
    `Unknown tool: "${resolvedToolName}". Available tools: ${Object.keys(config.tools).join(", ")}`
  );
  console.error('Run "citizen tools" to see all configured tools.');
  process.exit(1);
}

const prompt = buildMcpPrompt(issueId, projectSlug);

if (tool.deepLink) {
  let deepLink = tool.deepLink
    .replace("{prompt}", encodeURIComponent(prompt))
    .replace("{issueId}", issueId)
    .replace("{projectSlug}", projectSlug);
  if (repoUrl) {
    deepLink = deepLink.replace("{repoUrl}", encodeURIComponent(repoUrl));
  }
  openUrl(deepLink);
} else if (tool.command && tool.args) {
  const args = tool.args.map((a) =>
    a
      .replace("{prompt}", prompt)
      .replace("{issueId}", issueId)
      .replace("{projectSlug}", projectSlug)
      .replace("{repoUrl}", repoUrl ?? "")
  );
  spawnInTerminal(tool.command, args);
} else {
  console.error(`Tool "${resolvedToolName}" has no command or deepLink configured.`);
  process.exit(1);
}
