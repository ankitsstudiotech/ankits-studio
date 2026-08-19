/**
 * Stage 4A Part 2 — CLS/LCP/bytes sanity for flag false vs true.
 * Usage: PLAYWRIGHT_BASE_URL=... MODE=flag-true|flag-false node docs/revamp/_perf-premium-stage-4a-synthetic.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3456";
const MODE = process.env.MODE || "flag-true";
const OUT = path.resolve(
  "docs/revamp/screenshots/premium-stage-4a-synthetic-integration",
);
const ROUTES = [
  { name: "home", path: "/" },
  { name: "functional", path: "/programs/functional-training" },
  { name: "yoga", path: "/programs/yoga" },
];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const route of ROUTES) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });
  const page = await context.newPage();
  let imageBytes = 0;
  const imageUrls = [];
  page.on("response", async (res) => {
    try {
      const ct = res.headers()["content-type"] || "";
      const url = res.url();
      if (!ct.startsWith("image/") && !url.includes("/_next/image")) return;
      const buf = await res.body();
      imageBytes += buf.length;
      imageUrls.push({ url: url.slice(0, 120), bytes: buf.length });
    } catch {
      /* ignore */
    }
  });

  await page.addInitScript(() => {
    window.__cwv = { lcp: null, cls: 0 };
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__cwv.lcp = e.startTime;
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (!e.hadRecentInput) window.__cwv.cls += e.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {
      /* ignore */
    }
  });

  await page.goto(BASE + route.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  // Force LCP finalization
  await page.evaluate(() => window.dispatchEvent(new Event("visibilitychange")));

  const metrics = await page.evaluate(() => {
    const paint = performance.getEntriesByType("paint");
    const nav = performance.getEntriesByType("navigation")[0];
    return {
      fcp: paint.find((p) => p.name === "first-contentful-paint")?.startTime ?? null,
      lcp: window.__cwv?.lcp ?? null,
      cls: window.__cwv?.cls ?? 0,
      transferSize: nav?.transferSize ?? null,
      encodedBodySize: nav?.encodedBodySize ?? null,
      lcpElement: (() => {
        const entries = performance.getEntriesByType("largest-contentful-paint");
        const last = entries[entries.length - 1];
        return last?.element?.tagName || last?.url || null;
      })(),
    };
  });

  results.push({
    route: route.name,
    path: route.path,
    imageBytes,
    imageCount: imageUrls.length,
    topImages: imageUrls.sort((a, b) => b.bytes - a.bytes).slice(0, 5),
    ...metrics,
  });
  await context.close();
}

await browser.close();

const file = path.join(OUT, `perf-${MODE}.json`);
fs.writeFileSync(
  file,
  JSON.stringify({ mode: MODE, base: BASE, generatedAt: new Date().toISOString(), results }, null, 2),
);
console.log(JSON.stringify(results, null, 2));
console.log("Wrote", file);
