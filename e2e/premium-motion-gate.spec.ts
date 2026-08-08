import { expect, test } from "@playwright/test";

/**
 * Stage 3 — premium motion + reduced-motion acceptance.
 */
test.describe("premium motion gate", () => {
  test("homepage hero exposes masked line structure", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#home-hero-title")).toBeVisible();
    await expect(page.locator("#home-hero-title .motion-mask-line").first()).toBeVisible();
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
  });

  test("programme rows expose motion tone attributes", async ({ page }) => {
    await page.goto("/programs");
    const ft = page.locator('a[href="/programs/functional-training"]').first();
    const yoga = page.locator('a[href="/programs/yoga"]').first();
    const wedding = page.locator('a[href="/programs/wedding-choreography"]').first();
    await expect(ft).toHaveAttribute("data-motion-tone", "structured");
    await expect(yoga).toHaveAttribute("data-motion-tone", "calm");
    await expect(wedding).toHaveAttribute("data-motion-tone", "ceremonial");
    await ft.hover();
    await yoga.focus();
    await expect(yoga).toBeFocused();
  });

  test("mobile menu opens and closes with Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /Open menu/i }).click();
    await expect(page.getByRole("dialog", { name: /Mobile navigation/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /Mobile navigation/i })).toHaveCount(0);
  });

  test("reduced motion keeps hero and programme content visible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#home-hero-title")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/programs/yoga");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("FAQ accordion still toggles", async ({ page }) => {
    await page.goto("/");
    const item = page.locator("#faq details").first();
    await item.locator("summary").click();
    await expect(item).toHaveAttribute("open", "");
  });
});
