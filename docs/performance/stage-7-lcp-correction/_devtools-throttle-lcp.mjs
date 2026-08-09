import { chromium, devices } from "@playwright/test";
import fs from "node:fs";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3722";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  ...devices["Moto G Power"],
  colorScheme: "dark",
});
const page = await ctx.newPage();
const client = await ctx.newCDPSession(page);
await client.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});
await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

await page.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__lcp.push({
        t: e.startTime,
        size: e.size,
        tag: e.element?.tagName || null,
        text: (e.element?.textContent || "").trim().slice(0, 90),
        cls: (e.element?.className || "").toString().slice(0, 80),
      });
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
});

const t0 = Date.now();
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
const atDCL = await page.evaluate(() => {
  const el = document.querySelector(".hero-support p");
  const r = el?.getBoundingClientRect();
  return {
    html: document.documentElement.className,
    supportText: el?.textContent?.slice(0, 50) || null,
    h1: document.querySelector("#home-hero-title")?.textContent?.slice(0, 50) || null,
    rect: r
      ? {
          top: r.top,
          bottom: r.bottom,
          h: r.height,
          inView: r.top < innerHeight && r.bottom > 0,
          vh: innerHeight,
        }
      : null,
    lcp: window.__lcp,
  };
});
await page.waitForTimeout(7000);
const final = await page.evaluate(() => ({
  lcp: window.__lcp,
  paints: performance.getEntriesByType("paint").map((p) => ({
    name: p.name,
    t: p.startTime,
  })),
}));
const out = { elapsed: Date.now() - t0, atDCL, final };
fs.writeFileSync(
  "docs/performance/stage-7-lcp-correction/devtools-throttle-lcp.json",
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify(out, null, 2));
await browser.close();
