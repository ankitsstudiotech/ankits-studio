import { expect, test } from "@playwright/test";

test("home page loads and renders a main landmark", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
});

test("skip link is present and targets main content", async ({ page }) => {
  await page.goto("/");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toHaveAttribute("href", "#main-content");
});

test("robots meta is present on the home page", async ({ page }) => {
  await page.goto("/");
  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toBeAttached();
  await expect(robots).toHaveAttribute("content", /index/);
});

test("home does not show a mock-preview banner when the page is indexable", async ({ page }) => {
  await page.goto("/");
  const robots = page.locator('meta[name="robots"]');
  const content = (await robots.getAttribute("content")) ?? "";
  if (!/noindex/i.test(content)) {
    await expect(page.getByRole("status").filter({ hasText: /preview/i })).toHaveCount(0);
  }
});
