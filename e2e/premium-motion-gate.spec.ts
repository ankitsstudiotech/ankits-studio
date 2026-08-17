import { expect, test } from "@playwright/test";

/**
 * Stage 3 correction — premium motion, first-paint, progressive enhancement.
 */
test.describe("premium motion gate", () => {
  test("homepage hero exposes masked line structure and motion-ready", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#home-hero-title")).toBeVisible();
    await expect(page.locator("#home-hero-title .motion-mask-line").first()).toBeVisible();
    await expect(page.locator("#home-hero-title .motion-mask-inner").first()).toBeVisible();
    await expect(page.locator("html")).toHaveClass(/motion-ready|prm/);
  });

  test("hero support stays after headline in DOM order", async ({ page }) => {
    await page.goto("/");
    const order = await page.evaluate(() => {
      const title = document.querySelector("#home-hero-title");
      const support = document.querySelector(".hero-support");
      if (!title || !support) return null;
      const following =
        title.compareDocumentPosition(support) & Node.DOCUMENT_POSITION_FOLLOWING;
      return { titleBeforeSupport: following !== 0 };
    });
    expect(order?.titleBeforeSupport).toBe(true);
    await expect(page.locator("section[aria-labelledby='home-hero-title'] .hero-brand-motion")).toHaveCount(0);
  });

  test("programme rows expose motion tone attributes", async ({ page }) => {
    await page.goto("/");
    const ft = page.locator('#services a[href="/programs/functional-training"]');
    const yoga = page.locator('#services a[href="/programs/yoga"]');
    const wedding = page.locator('#services a[href="/programs/wedding-choreography"]');
    const zumba = page.locator('#services a[href="/programs/zumba"]');
    await expect(ft).toHaveAttribute("data-motion-tone", "structured");
    await expect(yoga).toHaveAttribute("data-motion-tone", "calm");
    await expect(wedding).toHaveAttribute("data-motion-tone", "ceremonial");
    await expect(zumba).toHaveAttribute("data-motion-tone", "fluid");
    await ft.hover();
    await yoga.focus();
    await expect(yoga).toBeFocused();
  });

  test("programme detail openings expose tone metadata", async ({ page }) => {
    await page.goto("/programs/functional-training");
    await expect(page.locator("[data-motion-tone='structured']").first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/programs/yoga");
    await expect(page.locator("[data-motion-tone='calm']").first()).toBeVisible();
    await page.goto("/programs/wedding-choreography");
    await expect(page.locator("[data-motion-tone='ceremonial']").first()).toBeVisible();
  });

  test("mobile menu opens and closes with Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /Open menu/i }).click();
    await expect(page.getByRole("dialog", { name: /Mobile navigation/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /Mobile navigation/i })).toHaveCount(0);
  });

  test("reduced motion keeps hero visible from first paint", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/prm/);
    const title = page.locator("#home-hero-title");
    await expect(title).toBeVisible();
    const transform = await title.locator(".motion-mask-inner").first().evaluate((el) => {
      return getComputedStyle(el).transform;
    });
    expect(transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)").toBeTruthy();
    const supportOpacity = await page.locator(".hero-support").evaluate((el) => {
      return getComputedStyle(el).opacity;
    });
    expect(Number(supportOpacity)).toBeGreaterThan(0.99);
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

test.describe("progressive enhancement", () => {
  test.use({ javaScriptEnabled: false });

  test("homepage hero content readable without JavaScript", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const title = page.locator("#home-hero-title");
    await expect(title).toBeVisible();
    const box = await title.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.y).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/./);
    await expect(page.locator(".hero-support").first()).toBeVisible();
  });
});
