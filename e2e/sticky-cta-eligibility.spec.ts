import { expect, test } from "@playwright/test";

/**
 * Sticky WhatsApp CTA — allowlist only (Prompt 3 correction).
 * Excluded routes must not mount the bar or reserve sticky padding.
 */
test.describe("sticky CTA eligibility", () => {
  test("excluded secondary/legal routes have no sticky bar", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of [
      "/privacy-policy",
      "/terms",
      "/trainers",
      "/transformations",
      "/blog",
      "/programs/personal-training",
      "/this-route-does-not-exist-sticky",
    ]) {
      await page.goto(route);
      await expect(page.locator("[data-sticky-cta-eligible]")).toHaveCount(0);
      await page.waitForFunction(() => !document.body.classList.contains("has-sticky-cta"));
      const hasClass = await page.evaluate(() =>
        document.body.classList.contains("has-sticky-cta"),
      );
      expect(hasClass, route).toBe(false);
    }
  });

  test("allowed programmes index mounts sticky CTA on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/programs");
    await expect(page.locator("[data-sticky-cta-eligible]")).toHaveCount(1);
    const hasClass = await page.evaluate(() =>
      document.body.classList.contains("has-sticky-cta"),
    );
    expect(hasClass).toBe(true);
  });

  test("trial soft-hides sticky when WhatsApp CTA is in view", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/trial");
    const sticky = page.locator("[data-sticky-cta-reveal]");
    await expect(sticky).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await expect(sticky).toHaveAttribute("data-sticky-cta-reveal", "true");
    await page.locator("#trial-whatsapp-cta").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(sticky).toHaveAttribute("data-sticky-cta-reveal", "false");
  });
});
