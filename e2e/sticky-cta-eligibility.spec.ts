import { expect, test } from "@playwright/test";

/**
 * Sticky WhatsApp CTA — browse allowlist; hard-exclude trial/contact;
 * soft-hide on pricing/timetable when enquiry builder is in view.
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
      "/trial",
      "/contact",
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

  test("pricing soft-hides sticky when enquiry builder is in view", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/pricing");
    const sticky = page.locator("[data-sticky-cta-reveal]");
    await expect(sticky).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    // Top of pricing may still show sticky if enquiry is below fold
    await page.locator("#pricing-enquiry").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(sticky).toHaveAttribute("data-sticky-cta-reveal", "false");
  });

  test("timetable soft-hides sticky when enquiry builder is in view", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/timetable");
    const sticky = page.locator("[data-sticky-cta-reveal]");
    await expect(sticky).toHaveCount(1);
    await page.locator("#availability-enquiry").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(sticky).toHaveAttribute("data-sticky-cta-reveal", "false");
  });
});
