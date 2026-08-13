import { expect, test } from "@playwright/test";

const WIDTHS = [360, 390, 430, 768, 1024, 1280, 1440, 1920];

async function measureCls(page: import("@playwright/test").Page, path: string) {
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as Array<{ hadRecentInput?: boolean; value: number }>) {
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
  await page.goto(path, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(5000);
  return page.evaluate(() => (window as unknown as { __cls: number }).__cls ?? 0);
}

test.describe("CLS and horizontal overflow gates", () => {
  test("Home Playwright CLS at 390×844 stays under 0.05", async ({ page }) => {
    const cls = await measureCls(page, "/");
    expect(cls).toBeLessThanOrEqual(0.05);
  });

  test("Functional Playwright CLS at 390×844 stays under 0.05", async ({ page }) => {
    const cls = await measureCls(page, "/programs/functional-training");
    expect(cls).toBeLessThanOrEqual(0.05);
  });

  test("Home has no horizontal overflow from 360 to 1920", async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "networkidle", timeout: 120_000 });
      const metrics = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(metrics.scrollWidth, `overflow at ${width}`).toBe(metrics.clientWidth);
    }
  });

  test("Home and Functional have no failed image requests", async ({ page }) => {
    const failed: string[] = [];
    page.on("response", (res) => {
      if (res.request().resourceType() === "image" && res.status() >= 400) {
        failed.push(`${res.status()} ${res.url()}`);
      }
    });
    page.on("requestfailed", (req) => {
      if (req.resourceType() === "image") failed.push(`failed ${req.url()}`);
    });
    for (const path of ["/", "/programs/functional-training"]) {
      await page.goto(path, { waitUntil: "networkidle", timeout: 120_000 });
    }
    expect(failed).toEqual([]);
  });
});
