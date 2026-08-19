/**
 * Stage 7 release evidence capture + crawl helpers.
 * PLAYWRIGHT_BASE_URL=… node docs/revamp/_capture-premium-stage-7.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3707";
const OUT = path.resolve("docs/revamp/screenshots/premium-stage-7-release-finish");
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith(".png") || f === "manifest.json") fs.unlinkSync(path.join(OUT, f));
}

const FULL_390 = [
  ["home", "/"],
  ["about", "/about"],
  ["programs", "/programs"],
  ["functional", "/programs/functional-training"],
  ["yoga", "/programs/yoga"],
  ["wedding", "/programs/wedding-choreography"],
  ["locations", "/locations"],
  ["airoli-sector-19", "/locations/airoli-sector-19"],
  ["pricing", "/pricing"],
  ["timetable", "/timetable"],
  ["trial", "/trial"],
  ["contact", "/contact"],
  ["privacy", "/privacy-policy"],
  ["terms", "/terms"],
  ["404", "/this-route-does-not-exist-stage-7"],
];

const FULL_768 = [
  ["home", "/"],
  ["programs", "/programs"],
  ["functional", "/programs/functional-training"],
  ["locations", "/locations"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
  ["contact", "/contact"],
];

const FULL_1920 = [
  ["home", "/"],
  ["about", "/about"],
  ["programs", "/programs"],
  ["functional", "/programs/functional-training"],
  ["yoga", "/programs/yoga"],
  ["locations", "/locations"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
];

const NORMAL = [
  ["home", "/"],
  ["functional", "/programs/functional-training"],
  ["branch", "/locations/airoli-sector-19"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
  ["contact", "/contact"],
];

async function capture(browser, prefix, w, h, routes, fullPage) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: "dark" });
  const page = await ctx.newPage();
  const dims = [];
  for (const [name, route] of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await pause(300);
    const file = `${prefix}-${name}.png`;
    await page.screenshot({ path: path.join(OUT, file), fullPage });
    const d = await page.evaluate(() => document.documentElement.clientWidth);
    if (d !== w) throw new Error(`Viewport ${file}: ${d}≠${w}`);
    dims.push({ file, width: w, height: h });
  }
  await ctx.close();
  return dims;
}

const browser = await chromium.launch({ headless: true });
let dims = [];
try {
  dims.push(...(await capture(browser, "full-390", 390, 844, FULL_390, true)));
  dims.push(...(await capture(browser, "full-1440", 1440, 900, FULL_390, true)));
  dims.push(...(await capture(browser, "full-768", 768, 1024, FULL_768, true)));
  dims.push(...(await capture(browser, "full-1920", 1920, 1080, FULL_1920, true)));
  dims.push(...(await capture(browser, "normal-390x844", 390, 844, NORMAL, false)));
  dims.push(...(await capture(browser, "normal-1440x900", 1440, 900, NORMAL, false)));
} finally {
  await browser.close();
}

const shots = fs.readdirSync(OUT).filter((f) => f.endsWith(".png")).sort();
fs.writeFileSync(
  path.join(OUT, "manifest.json"),
  JSON.stringify(
    {
      stage: "premium-stage-7-release-finish",
      syntheticFlag: false,
      base: BASE,
      generatedAt: new Date().toISOString(),
      counts: { total: shots.length },
      screenshots: shots,
      dimensions: dims,
    },
    null,
    2,
  ),
);
console.log("shots", shots.length);
