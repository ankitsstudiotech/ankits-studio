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

test("non-production responses carry a noindex robots meta tag (DECISIONS.md ADR-011)", async ({ page }) => {
  await page.goto("/");
  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute("content", /noindex/);
});
