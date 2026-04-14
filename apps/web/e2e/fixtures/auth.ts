import { test as base, type Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const STORAGE_STATE_PATH = path.join(__dirname, "../.auth/storage-state.json");

/**
 * Authenticated page fixture for E2E tests.
 *
 * Uses saved browser state (cookies/localStorage) from a prior login.
 * Run `pnpm test:e2e:setup` to log in once and save the session.
 */
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ browser }, use) => {
    if (!fs.existsSync(STORAGE_STATE_PATH)) {
      throw new Error(
        "No saved auth state found. Run `pnpm test:e2e:setup` to log in and save your session."
      );
    }

    const context = await browser.newContext({
      storageState: STORAGE_STATE_PATH,
    });
    const page = await context.newPage();

    await use(page);

    await context.close();
  },
});

export { expect } from "@playwright/test";
