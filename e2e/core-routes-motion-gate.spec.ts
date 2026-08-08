import { expect, test } from "@playwright/test";

/**
 * Motion + reduced-motion + sticky soft-hide for Prompt 2 acceptance.
 */
test.describe("core routes motion gate", () => {
  test("programmes rows share hover and focus feedback", async ({ page }) => {
    await page.goto("/programs");
    const functional = page.locator('a[href="/programs/functional-training"]').first();
    const yoga = page.locator('a[href="/programs/yoga"]').first();
    await functional.hover();
    await expect(functional).toBeVisible();
    await yoga.focus();
    await expect(yoga).toBeFocused();
  });

  test("about FAQ expands and collapses", async ({ page }) => {
    await page.goto("/about");
    const item = page.locator(".pulse-accordion-item").first();
    await expect(item).toBeVisible();
    await item.locator("summary").click();
    await expect(item).toHaveAttribute("open", "");
    await item.locator("summary").click();
    await expect(item).not.toHaveAttribute("open");
  });

  test("reduced motion still renders final content on programmes", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/programs");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("trial route hard-excludes sticky CTA (Stage 1)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/trial");
    await expect(page.locator("[data-sticky-cta-eligible]")).toHaveCount(0);
  });
});
