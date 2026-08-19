import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [360, 390, 430, 768, 1024, 1280, 1440, 1920];
const PATH = "/programs/corporate-wellness";

async function measureCls(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as Array<{
          hadRecentInput?: boolean;
          value: number;
        }>) {
          if (!entry.hadRecentInput) {
            (window as unknown as { __cls: number }).__cls += entry.value;
          }
        }
      });
      po.observe({ type: "layout-shift", buffered: true });
    } catch {
      /* layout-shift observer unsupported */
    }
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PATH, { waitUntil: "load", timeout: 120_000 });
  await page.waitForTimeout(4000);
  return page.evaluate(() => (window as unknown as { __cls: number }).__cls ?? 0);
}

test.describe("Corporate Wellness media acceptance", () => {
  test("renders illustrative hero without concept badge or trial copy", async ({ page }) => {
    await page.goto(PATH, { waitUntil: "load" });
    const hero = page.locator('[data-media-slot="programme.corporate-wellness.hero"]');
    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("data-media-status", "illustrative-ai");
    await expect(page.locator("[data-compose-family='service']").first()).toBeVisible();
    await expect(page.locator("[data-service-variant='corporate']").first()).toBeVisible();
    await expect(page.locator("[data-motion-tone='direct']").first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Enquire about Corporate Wellness/i }).first()).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/AI concept preview/i);
    expect(text).not.toMatch(/Enquire about a free trial/i);
    expect(text).toMatch(/Planning & availability/i);
    const img = hero.locator("img");
    await expect(img).toHaveAttribute(
      "alt",
      "Illustrative workplace wellness session with a coach guiding a small group.",
    );
  });

  test("CLS at 390×844 stays under 0.05 with H1 on first paint", async ({ page }) => {
    const cls = await measureCls(page);
    expect(cls).toBeLessThanOrEqual(0.05);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("has no horizontal overflow from 360 to 1920", async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(PATH, { waitUntil: "load", timeout: 120_000 });
      const metrics = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(metrics.scrollWidth, `overflow at ${width}`).toBe(metrics.clientWidth);
    }
  });

  test("has no failed image requests", async ({ page }) => {
    const failed: string[] = [];
    page.on("response", (res) => {
      if (res.request().resourceType() === "image" && res.status() >= 400) {
        failed.push(`${res.status()} ${res.url()}`);
      }
    });
    page.on("requestfailed", (req) => {
      if (req.resourceType() === "image") failed.push(`failed ${req.url()}`);
    });
    await page.goto(PATH, { waitUntil: "load", timeout: 120_000 });
    expect(failed).toEqual([]);
  });

  test("reduced motion still shows the workplace hero", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(PATH, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('[data-media-slot="programme.corporate-wellness.hero"]')).toBeVisible();
  });
});
