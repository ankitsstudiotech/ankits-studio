import { expect, test } from "@playwright/test";

/**
 * Prompt 3 secondary-route smoke — load + reduced-motion.
 * Does not assert approved core-route visuals.
 */
test.describe("secondary routes smoke", () => {
  test("trainers loads without media placeholders or owner notes", async ({ page }) => {
    await page.goto("/trainers");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/Owner-provided|Development note|real photography pending/i)).toHaveCount(
      0,
    );
  });

  test("transformations loads consent-first without development notes", async ({ page }) => {
    await page.goto("/transformations");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByText(/member.?s permission|permission/i).first()).toBeVisible();
    await expect(page.getByText(/Development note/i)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /What you can explore today/i })).toHaveCount(1);
    await expect(page.getByText(/More stories will be added as members approve them/i)).toBeVisible();
  });

  test("blog studio notes hub has no sample cards", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /Studio Notes/i })).toBeVisible();
    await expect(page.getByText(/Sample: Starting with strength/i)).toHaveCount(0);
  });

  test("sample blog slug is not a published article", async ({ page }) => {
    const response = await page.goto("/blog/sample-starting-with-strength");
    const status = response?.status() ?? 0;
    // Production build with dynamicParams=false returns HTTP 404.
    // `nextdev` (Playwright webServer) may soft-handle unknown static params as 200.
    if (status === 404) {
      await expect(page.getByRole("heading", { name: /Page not found/i })).toBeVisible();
      return;
    }
    await expect(page.getByText(/Sample: Starting with strength training/i)).toHaveCount(0);
    await expect(page.getByText(/Illustrative sample post/i)).toHaveCount(0);
    await expect(page.getByText(/Sample article for layout/i)).toHaveCount(0);
  });

  test("privacy and terms use legal measure", async ({ page }) => {
    await page.goto("/privacy-policy");
    await expect(page.getByRole("heading", { name: /Privacy policy/i })).toBeVisible();
    await expect(page.getByText(/Last updated: August 2026/i)).toBeVisible();

    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /Terms of use/i })).toBeVisible();
    await expect(page.getByText(/Last updated: August 2026/i)).toBeVisible();
  });

  test("404 page offers discovery links", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-prompt3");
    await expect(page.getByRole("heading", { name: /Page not found/i })).toBeVisible();
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: /^Home$/i })).toBeVisible();
    await expect(main.getByRole("link", { name: /Programmes/i })).toBeVisible();
    await expect(main.getByRole("link", { name: /Find a Studio/i })).toBeVisible();
    await expect(main.getByRole("link", { name: /Book a Free Trial/i })).toBeVisible();
  });

  test("legacy programme notice is dark Pulse customer copy", async ({ page }) => {
    await page.goto("/programs/strength-training");
    await expect(page.getByText(/This programme list has been updated/i)).toBeVisible();
    await expect(page.getByText(/route retained|taxonomyStatus|migration-pending/i)).toHaveCount(0);
    await expect(page.getByRole("link", { name: /See current programmes/i })).toBeVisible();
  });

  test("reduced motion still shows trainers content", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/trainers");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
  });
});
