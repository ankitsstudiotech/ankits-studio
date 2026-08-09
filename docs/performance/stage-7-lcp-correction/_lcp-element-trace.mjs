/**
 * Identify LCP element via PerformanceObserver under mobile CPU throttle.
 * PLAYWRIGHT_BASE_URL=… node docs/performance/stage-7-lcp-correction/_lcp-element-trace.mjs
 */
import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3717";
const OUT = path.resolve("docs/performance/stage-7-lcp-correction");

const browser = await chromium.launch({ headless: true });
const results = [];

for (const route of ["/", "/programs/functional-training"]) {
  for (let run = 1; run <= 3; run++) {
    const ctx = await browser.newContext({
      ...devices["Pixel 7"],
      colorScheme: "dark",
    });
    const page = await ctx.newPage();
    const client = await ctx.newCDPSession(page);
    // Match Lighthouse mobile-ish CPU slowdown
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    await page.addInitScript(() => {
      window.__lcpEntries = [];
      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__lcpEntries.push({
            startTime: e.startTime,
            size: e.size,
            url: e.url || null,
            tag: e.element?.tagName || null,
            id: e.element?.id || null,
            className: e.element?.className || null,
            text: (e.element?.textContent || "").trim().slice(0, 120),
          });
        }
      });
      po.observe({ type: "largest-contentful-paint", buffered: true });
    });

    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    const entries = await page.evaluate(() => window.__lcpEntries || []);
    const last = entries[entries.length - 1] || null;
    results.push({ route, run, lcp: last, entries });
    await ctx.close();
  }
}

await browser.close();
const payload = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  method: "PerformanceObserver + CDP CPU×4",
  results,
};
fs.writeFileSync(path.join(OUT, "home-lcp-element.json"), JSON.stringify(payload, null, 2));
console.log(JSON.stringify(payload, null, 2));
