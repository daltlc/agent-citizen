import { test, expect } from "./fixtures/auth";

test.describe("Create Problem - unauthenticated", () => {
  test("redirects to /login when not signed in", async ({ page }) => {
    await page.goto("/problems/new");
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });
});

test.describe("Create Problem - authenticated", () => {
  test("renders the form with all fields", async ({ authedPage: page }) => {
    await page.goto("/problems/new");

    await expect(
      page.getByRole("heading", { name: "Identify a Problem" })
    ).toBeVisible();
    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
    await expect(page.getByLabel("GitHub Repository URL")).toBeVisible();
    await expect(page.getByLabel("Category")).toBeVisible();
    await expect(page.getByLabel("Tags (comma-separated)")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create Problem" })
    ).toBeVisible();
  });

  test("browser validation blocks empty required fields", async ({
    authedPage: page,
  }) => {
    await page.goto("/problems/new");

    await page.getByRole("button", { name: "Create Problem" }).click();

    // Form should not navigate away -- browser required validation prevents it
    expect(page.url()).toContain("/problems/new");
  });

  test("shows server validation error for too-short title", async ({
    authedPage: page,
  }) => {
    await page.goto("/problems/new");

    await page.getByLabel("Title").fill("ab");
    await page.getByLabel("Description").fill("A valid description that is long enough");
    await page.getByLabel("GitHub Repository URL").fill("https://github.com/octocat/Hello-World");

    // Select a category via the z-select trigger
    await page.locator('z-select button[slot="trigger"]').click();
    await page.locator('[data-value="climate"]').click();

    await page.getByRole("button", { name: "Create Problem" }).click();

    // Wait for server error banner
    await expect(page.locator(".bg-red-900\\/50")).toBeVisible({ timeout: 10000 });
  });

  test("shows error for non-existent GitHub repo", async ({
    authedPage: page,
  }) => {
    await page.goto("/problems/new");

    await page.getByLabel("Title").fill("Test Problem Title");
    await page.getByLabel("Description").fill("A valid description that is long enough");
    await page.getByLabel("GitHub Repository URL").fill(
      "https://github.com/zzz-nonexistent-owner-zzz/no-repo"
    );

    await page.locator('z-select button[slot="trigger"]').click();
    await page.locator('[data-value="climate"]').click();

    await page.getByRole("button", { name: "Create Problem" }).click();

    await expect(
      page.getByText("GitHub repository not found")
    ).toBeVisible({ timeout: 10000 });
  });

  test("successful submission redirects to problem page", async ({
    authedPage: page,
  }) => {
    await page.goto("/problems/new");

    await page.getByLabel("Title").fill("E2E Test Problem");
    await page.getByLabel("Description").fill(
      "This is an end-to-end test problem created by Playwright"
    );
    await page.getByLabel("GitHub Repository URL").fill(
      "https://github.com/octocat/Hello-World"
    );

    await page.locator('z-select button[slot="trigger"]').click();
    await page.locator('[data-value="education"]').click();

    await page.getByLabel("Tags (comma-separated)").fill("e2e, testing");

    await page.getByRole("button", { name: "Create Problem" }).click();

    // Should redirect to the new problem page
    await page.waitForURL("**/problems/**", { timeout: 15000 });
    expect(page.url()).toMatch(/\/problems\/[a-zA-Z0-9-]+$/);
  });

  test("handles special characters in tags", async ({
    authedPage: page,
  }) => {
    await page.goto("/problems/new");

    await page.getByLabel("Title").fill("Special Tags Test");
    await page.getByLabel("Description").fill(
      "Testing that special characters in tags are handled correctly"
    );
    await page.getByLabel("GitHub Repository URL").fill(
      "https://github.com/octocat/Hello-World"
    );

    await page.locator('z-select button[slot="trigger"]').click();
    await page.locator('[data-value="open_data"]').click();

    await page.getByLabel("Tags (comma-separated)").fill("c++, c#, node.js, machine-learning");

    await page.getByRole("button", { name: "Create Problem" }).click();

    await page.waitForURL("**/problems/**", { timeout: 15000 });
    expect(page.url()).toMatch(/\/problems\/[a-zA-Z0-9-]+$/);
  });
});
