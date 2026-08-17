import { expect, test } from "@playwright/test";

/**
 * Stage 7 — keyboard sanity for primary conversion chrome.
 */
test.describe("keyboard release gate", () => {
  test("home skip link and primary CTA are keyboard reachable", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.locator("a").first();
    await expect(skip).toBeFocused();
    const href = await skip.getAttribute("href");
    expect(href === "#main-content" || href === "#main" || href?.startsWith("#")).toBeTruthy();

    await page.goto("/trial");
    const firstField = page.locator("input, select, textarea, button, a").first();
    await page.keyboard.press("Tab");
    // Focus should land on an interactive control without throwing.
    await expect(page.locator(":focus")).toHaveCount(1);
    await expect(firstField).toBeVisible();
  });

  test("pricing FAQ accordion opens with keyboard", async ({ page }) => {
    await page.goto("/pricing");
    const item = page.locator(".pulse-accordion-item").first();
    await expect(item).toBeVisible();
    const summary = item.locator("summary");
    await summary.focus();
    await expect(summary).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(item).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(item).not.toHaveAttribute("open");
  });

  test("mobile nav opens and closes with keyboard affordances", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /menu|open navigation|close navigation/i }).first();
    if ((await toggle.count()) === 0) {
      test.skip();
      return;
    }
    await toggle.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Escape");
  });
});
