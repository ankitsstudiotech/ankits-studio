import { expect, test } from "@playwright/test";

/**
 * Screenshot-first homepage visual gate (Prompt 1).
 * Evidence: docs/revamp/screenshots/shared-system-homepage-repair/
 */
test.describe("homepage visual system gate", () => {
  test("home has no white logo plate, neighbourhood phrase, or withheld footer links", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();

    await expect(page.locator("header img").first()).toHaveAttribute(
      "src",
      /ankits-studio-symbol-transparent/,
    );
    await expect(page.locator("header .bg-white")).toHaveCount(0);

    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/open neighbourhood studio/i);

    const footer = await page.locator("footer").innerText();
    expect(footer).not.toMatch(/\bTrainers\b/);
    expect(footer).not.toMatch(/Member stories/i);
    expect(footer).not.toMatch(/\bBlog\b/);
    expect(footer).toMatch(/Privacy/i);
    expect(footer).toMatch(/Terms/i);
  });

  test("programme rows share display uppercase treatment", async ({ page }) => {
    await page.goto("/");
    const titles = page.locator("#services a[href^='/programs/'] h3, #services a[href^='/programs/'] h4");
    const count = await titles.count();
    expect(count).toBeGreaterThanOrEqual(7);

    for (let i = 0; i < count; i++) {
      const el = titles.nth(i);
      await expect(el).toHaveCSS("text-transform", "uppercase");
      const font = await el.evaluate((node) => getComputedStyle(node).fontFamily);
      expect(font.toLowerCase()).toMatch(/bebas/);
    }
  });

  test("practical and faq stay on dark field surfaces", async ({ page }) => {
    await page.goto("/");
    const practicalBg = await page.locator("#practical").evaluate((el) => getComputedStyle(el).backgroundColor);
    const faqBg = await page.locator("#faq").evaluate((el) => getComputedStyle(el).backgroundColor);
    // near-black field — not white
    expect(practicalBg).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
    expect(faqBg).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
  });
});
