/**
 * Interactive auth setup for E2E tests.
 *
 * Opens a browser so you can log in via GitHub OAuth.
 * Saves the session to e2e/.auth/storage-state.json for reuse.
 *
 * Usage: pnpm test:e2e:setup
 */
import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

const STORAGE_STATE_DIR = path.join(__dirname, ".auth");
const STORAGE_STATE_PATH = path.join(STORAGE_STATE_DIR, "storage-state.json");

async function setup() {
  if (!fs.existsSync(STORAGE_STATE_DIR)) {
    fs.mkdirSync(STORAGE_STATE_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("http://localhost:3000/login");

  console.log("\n  Log in via GitHub in the browser window.");
  console.log("  Once you see the dashboard, press Enter here to save the session.\n");

  // Wait for the user to log in and land on an authenticated page
  await new Promise<void>((resolve) => {
    process.stdin.once("data", () => resolve());
  });

  await context.storageState({ path: STORAGE_STATE_PATH });
  console.log(`  Session saved to ${STORAGE_STATE_PATH}`);

  await browser.close();
}

setup().catch((err) => {
  console.error("Auth setup failed:", err);
  process.exit(1);
});
