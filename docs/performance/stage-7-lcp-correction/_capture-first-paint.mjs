/**
 * First-paint hero timeline + network/main-thread summaries.
 * PLAYWRIGHT_BASE_URL=… node docs/performance/stage-7-lcp-correction/_capture-first-paint.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3717";
const OUT = path.resolve("docs/performance/stage-7-lcp-correction");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  colorScheme: "dark",
});
const page = await ctx.newPage();

const requests = [];
const failed = [];
page.on("request", (req) => {
  requests.push({ url: req.url(), resourceType: req.resourceType() });
});
page.on("requestfailed", (req) => {
  failed.push({ url: req.url(), error: req.failure()?.errorText });
});

await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector("#home-hero-title", { timeout: 15000 });

const shots = [
  ["first-paint-home.png", 0],
  ["hero-100ms.png", 100],
  ["hero-250ms.png", 250],
  ["hero-500ms.png", 500],
];

let elapsed = 0;
for (const [file, target] of shots) {
  const wait = Math.max(0, target - elapsed);
  if (wait > 0) await page.waitForTimeout(wait);
  elapsed = target;
  await page.screenshot({ path: path.join(OUT, file) });
}

await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, "hero-final.png") });

const visibility = await page.evaluate(() => {
  const h1 = document.querySelector("#home-hero-title");
  const firstLine = h1?.querySelector(".motion-mask-line:first-child .motion-mask-inner");
  const brand = document.querySelector(".hero-brand-motion");
  const rect = firstLine?.getBoundingClientRect();
  const style = firstLine ? getComputedStyle(firstLine) : null;
  return {
    htmlClass: document.documentElement.className,
    h1Text: h1?.textContent?.trim() ?? null,
    firstLineText: firstLine?.textContent?.trim() ?? null,
    firstLineTransform: style?.transform ?? null,
    firstLineOpacity: style?.opacity ?? null,
    firstLineInViewport: rect
      ? rect.bottom > 0 && rect.top < innerHeight && rect.height > 0
      : false,
    brandOpacity: brand ? getComputedStyle(brand).opacity : null,
  };
});

const longTasks = await page.evaluate(() => {
  try {
    return performance.getEntriesByType("longtask").map((e) => ({
      start: e.startTime,
      duration: e.duration,
      name: e.name,
    }));
  } catch {
    return [];
  }
});

const paints = await page.evaluate(() =>
  performance.getEntriesByType("paint").map((p) => ({ name: p.name, startTime: p.startTime })),
);

const synth = requests.filter((r) => /synthetic-preview|AI concept/i.test(r.url));
const localhost = requests.filter(
  (r) => /localhost|127\.0\.0\.1/.test(r.url) && !r.url.startsWith(BASE),
);

fs.writeFileSync(
  path.join(OUT, "network-summary.json"),
  JSON.stringify(
    {
      base: BASE,
      generatedAt: new Date().toISOString(),
      requestCount: requests.length,
      syntheticRequests: synth.length,
      synthetic: synth,
      failed,
      localhostLeak: localhost,
      byType: requests.reduce((acc, r) => {
        acc[r.resourceType] = (acc[r.resourceType] || 0) + 1;
        return acc;
      }, {}),
      urls: [...new Set(requests.map((r) => r.url))],
    },
    null,
    2,
  ),
);

fs.writeFileSync(
  path.join(OUT, "main-thread-summary.json"),
  JSON.stringify({ paints, longTasks, visibility }, null, 2),
);

fs.writeFileSync(
  path.join(OUT, "first-paint-visibility.json"),
  JSON.stringify({ visibility, paints }, null, 2),
);

console.log(JSON.stringify({ visibility, paints, synth: synth.length, failed: failed.length }, null, 2));
await browser.close();
