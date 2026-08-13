import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [360, 390, 430, 768, 1024, 1280, 1440, 1920];

async function measureCls(page: Page, path: string) {
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

async function applySlow4gThrottle(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: Math.floor((1.6 * 1024 * 1024) / 8),
    uploadThroughput: Math.floor((750 * 1024) / 8),
    connectionType: "cellular4g",
  });
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
}

async function measureThrottledCls(page: Page, path: string) {
  await applySlow4gThrottle(page);
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
  await page.goto(path, { waitUntil: "domcontentloaded", timeout: 180_000 });
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
    test.setTimeout(180_000);
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30_000 });
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
    for (const path of ["/", "/programs/functional-training", "/programs/corporate-wellness"]) {
      await page.goto(path, { waitUntil: "networkidle", timeout: 120_000 });
    }
    expect(failed).toEqual([]);
  });
});

test.describe("throttled footer layout-shift race", () => {
  test.setTimeout(180_000);

  test("Home Slow-4G CLS stays under 0.05 and footer stays below the first viewport", async ({
    page,
  }) => {
    const cls = await measureThrottledCls(page, "/");
    expect(cls).toBeLessThanOrEqual(0.05);

    await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
    const geometry = await page.evaluate(() => {
      const footer = document.querySelector("footer");
      const rect = footer?.getBoundingClientRect();
      return {
        viewportHeight: window.innerHeight,
        footerTop: rect ? rect.top + window.scrollY : null,
      };
    });
    expect(geometry.footerTop).not.toBeNull();
    expect(geometry.footerTop!).toBeGreaterThanOrEqual(geometry.viewportHeight);
  });

  test("Functional Slow-4G CLS stays under 0.05 and footer stays below the first viewport", async ({
    page,
  }) => {
    const cls = await measureThrottledCls(page, "/programs/functional-training");
    expect(cls).toBeLessThanOrEqual(0.05);

    await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
    const geometry = await page.evaluate(() => {
      const footer = document.querySelector("footer");
      const rect = footer?.getBoundingClientRect();
      return {
        viewportHeight: window.innerHeight,
        footerTop: rect ? rect.top + window.scrollY : null,
      };
    });
    expect(geometry.footerTop).not.toBeNull();
    expect(geometry.footerTop!).toBeGreaterThanOrEqual(geometry.viewportHeight);
  });
});
