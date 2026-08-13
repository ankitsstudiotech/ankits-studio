/**
 * One-shot Home + Functional CLS regression after Corporate Wellness media.
 * Usage: $env:BASE_URL="http://localhost:3010"; node docs/revamp/_measure-corporate-wellness-stability.mjs
 */
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3011";
const OUT = join(process.cwd(), "docs/revamp/screenshots/corporate-wellness-ai-final");

async function measure(page, path) {
  await page.addInitScript(() => {
    window.__cls = 0;
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      });
      po.observe({ type: "layout-shift", buffered: true });
    } catch {
      /* ignore */
    }
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForTimeout(4000);
  return page.evaluate(() => ({
    cls: window.__cls ?? 0,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: Boolean(document.querySelector("h1")),
  }));
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = {};
  for (const [name, path] of [
    ["home", "/"],
    ["functional", "/programs/functional-training"],
    ["corporate", "/programs/corporate-wellness"],
  ]) {
    const page = await browser.newPage();
    results[name] = await measure(page, path);
    await page.close();
  }
  await browser.close();
  const pass = Object.values(results).every((r) => r.cls <= 0.05 && r.overflow === 0 && r.h1);
  await writeFile(join(OUT, "stability-regression.json"), JSON.stringify({ capturedAt: new Date().toISOString(), pass, results }, null, 2));
  console.log(JSON.stringify({ pass, results }, null, 2));
  if (!pass) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
