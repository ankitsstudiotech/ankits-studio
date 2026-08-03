import { expect, test } from "@playwright/test";

const CORE = [
  "/about",
  "/programs",
  "/programs/functional-training",
  "/locations",
  "/locations/airoli-sector-19",
  "/timetable",
  "/pricing",
  "/trial",
  "/contact",
];

test.describe("core routes visual gate", () => {
  for (const route of CORE) {
    test(`${route} loads without mock banner or internal wording`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      const text = await page.locator("body").innerText();
      expect(text).not.toMatch(/Mock preview/i);
      expect(text).not.toMatch(/branch-floor/i);
      expect(text).not.toMatch(/owner-confirmed/i);
      expect(text).not.toMatch(/open neighbourhood studio/i);
      expect(text).not.toMatch(/we do not publish class-by-class/i);
    });
  }

  test("/book-a-free-trial redirects to /trial", async ({ page }) => {
    await page.goto("/book-a-free-trial");
    await expect(page).toHaveURL(/\/trial$/);
  });

  test("programmes index uses ProgrammeRow uppercase titles", async ({ page }) => {
    await page.goto("/programs");
    const titles = page.locator("#programmes-index a[href^='/programs/'] h3, #programmes-index a[href^='/programs/'] h4");
    const count = await titles.count();
    expect(count).toBeGreaterThanOrEqual(7);
    for (let i = 0; i < count; i++) {
      await expect(titles.nth(i)).toHaveCSS("text-transform", "uppercase");
    }
  });
});
