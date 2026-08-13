import { chromium } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3100";
const routes = [
  ["home", "/"],
  ["functional", "/programs/functional-training"],
  ["corporate", "/programs/corporate-wellness"],
];

const browser = await chromium.launch({ headless: true });
const out = {};
for (const [name, route] of routes) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    colorScheme: "dark",
  });
  await page.addInitScript(() => {
    window.__webVitals = { cls: 0, lcp: null, fcp: null };
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.entryType === "paint" && e.name === "first-contentful-paint") {
            window.__webVitals.fcp = e.startTime;
          }
        }
      }).observe({ type: "paint", buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__webVitals.lcp = last.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (!e.hadRecentInput) window.__webVitals.cls += e.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {}
  });
  const t0 = Date.now();
  await page.goto(BASE + route, { waitUntil: "load", timeout: 60_000 });
  await page.waitForTimeout(5000);
  const vitals = await page.evaluate(() => window.__webVitals);
  const longTasks = await page.evaluate(() =>
    performance.getEntriesByType("longtask").reduce((sum, e) => sum + e.duration, 0),
  );
  out[name] = {
    route,
    navMs: Date.now() - t0,
    fcp: vitals.fcp,
    lcp: vitals.lcp,
    cls: vitals.cls,
    tbtApproxFromLongTasks: longTasks,
  };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
