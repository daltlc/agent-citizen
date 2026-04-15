#!/usr/bin/env node

import { Command } from "commander";
import { setup, uninstall, listTools } from "./setup.js";

const program = new Command();

program
  .name("citizen")
  .description("Citizen CLI - launch coding tools from the web")
  .version("0.1.0");

program
  .command("setup")
  .description("Register the citizen:// protocol handler and create default config")
  .option("--key <apiKey>", "Citizen API key to register CLI installation with the server")
  .option("--server <url>", "Citizen server URL", "https://citizen.dev")
  .action((opts: { key?: string; server?: string }) => {
    setup(opts.key, opts.server);
  });

program
  .command("uninstall")
  .description("Remove the citizen:// protocol handler")
  .action(() => {
    uninstall();
  });

program
  .command("tools")
  .description("List configured tools")
  .action(() => {
    listTools();
  });

program.parse();
