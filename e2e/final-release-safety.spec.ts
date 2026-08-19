import { expect, test } from "@playwright/test";

const INDEXABLE = [
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/programs/corporate-wellness",
  "/locations",
  "/locations/airoli-sector-19",
  "/pricing",
  "/timetable",
  "/trial",
  "/contact",
  "/privacy-policy",
  "/terms",
] as const;

const LEAK = /Development preview|Mock preview|Demonstration mode|AI concept preview|Illustrative member|Illustrative transformation/i;

test.describe("final production HTML safety", () => {
  for (const route of INDEXABLE) {
    test(`${route} has no preview/dev leak copy when indexable`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.ok()).toBeTruthy();
      const robots = (await page.locator('meta[name="robots"]').getAttribute("content")) ?? "";
      const body = await page.locator("body").innerText();
      if (!/noindex/i.test(robots)) {
        expect(body, route).not.toMatch(LEAK);
        expect(body, route).not.toMatch(/localhost|127\.0\.0\.1/);
        await expect(page.getByRole("status").filter({ hasText: /preview/i })).toHaveCount(0);
      }
    });
  }

  test("Google reviews chapter is live or the verified fallback — never an error shell", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const chapter = page.locator("#google-reviews");
    await expect(chapter).toBeVisible();
    await expect(chapter).toContainText(/Reviews on Google/i);
    await expect(chapter).not.toContainText(/reviews failed|quota exceeded|Place ID missing/i);
    const mode = await chapter.getAttribute("data-google-proof-mode");
    if (mode === "live-google-reviews") {
      await expect(chapter).toContainText(/What members are saying/i);
      await expect(chapter.getByRole("link", { name: /View review on Google Maps/i }).first()).toBeVisible();
    } else {
      await expect(chapter).not.toContainText(/What members are saying/i);
      await expect(chapter).not.toContainText(/★|⭐/);
      await expect(chapter.getByRole("link", { name: /View on Google/i })).toHaveCount(4);
    }
  });

  test("Corporate Wellness sticky is enquiry, not trial", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/programs/corporate-wellness", { waitUntil: "domcontentloaded" });
    const sticky = page.locator("[data-sticky-cta-intent='service-enquiry']");
    await expect(sticky).toBeAttached();
    await expect(sticky).toContainText(/For teams/i);
    await expect(sticky).toContainText(/Enquire on WhatsApp/i);
    await expect(sticky).not.toContainText(/trial/i);
  });
});
