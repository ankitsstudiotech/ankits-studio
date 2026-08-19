/**
 * Playwright navigation timing sanity for Stage 7.
 * PLAYWRIGHT_BASE_URL=… node docs/revamp/_stage7-perf-timing.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3707";
const routes = ["/", "/programs", "/programs/functional-training", "/locations", "/pricing", "/trial"];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const rows = [];

for (const route of routes) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paints = performance.getEntriesByType("paint");
    const fcp = paints.find((p) => p.name === "first-contentful-paint")?.startTime;
    return {
      dcl: nav?.domContentLoadedEventEnd,
      load: nav?.loadEventEnd,
      transferSize: nav?.transferSize,
      encodedBodySize: nav?.encodedBodySize,
      fcp,
    };
  });
  rows.push({ route, ...metrics });
}

await browser.close();
fs.mkdirSync("docs/performance", { recursive: true });
fs.writeFileSync("docs/performance/stage-7-nav-timing.json", JSON.stringify({ base: BASE, generatedAt: new Date().toISOString(), rows }, null, 2));
console.log(JSON.stringify(rows, null, 2));
