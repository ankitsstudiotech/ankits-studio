/**
 * Stage 6 trust evidence capture.
 * MODE=flag-false|flag-true PLAYWRIGHT_BASE_URL=… node docs/revamp/_capture-premium-stage-6.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3606";
const MODE = process.env.MODE || "flag-false";
const OUT = path.resolve("docs/revamp/screenshots/premium-stage-6-trust");

const FULL = [
  ["home", "/"],
  ["about", "/about"],
  ["locations", "/locations"],
  ["airoli-sector-19", "/locations/airoli-sector-19"],
  ["airoli-sector-8", "/locations/airoli-sector-8"],
  ["ghansoli", "/locations/ghansoli"],
  ["thane", "/locations/thane"],
  ["programs", "/programs"],
  ["functional-training", "/programs/functional-training"],
  ["home-personal-training", "/programs/home-personal-training"],
  ["online-training", "/programs/online-training"],
  ["wedding-choreography", "/programs/wedding-choreography"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
  ["contact", "/contact"],
  ["trainers", "/trainers"],
  ["transformations", "/transformations"],
];

const FULL_768 = [
  ["home", "/"],
  ["about", "/about"],
  ["locations", "/locations"],
  ["airoli-sector-19", "/locations/airoli-sector-19"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
  ["contact", "/contact"],
];

const NORMAL = [
  ["home", "/"],
  ["about", "/about"],
  ["airoli-sector-19", "/locations/airoli-sector-19"],
  ["trial", "/trial"],
  ["pricing", "/pricing"],
  ["contact", "/contact"],
];

const SYNTH = [
  ["home", "/"],
  ["about", "/about"],
  ["functional", "/programs/functional-training"],
  ["locations", "/locations"],
];

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

fs.mkdirSync(OUT, { recursive: true });

async function capture(browser, prefix, w, h, routes, fullPage) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  const dims = [];
  for (const [name, route] of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await pause(350);
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
  if (MODE === "flag-true") {
    for (const f of fs.readdirSync(OUT)) {
      if (f.startsWith("synth-")) fs.unlinkSync(path.join(OUT, f));
    }
    dims.push(...(await capture(browser, "synth-390", 390, 844, SYNTH, true)));
    dims.push(...(await capture(browser, "synth-1440", 1440, 900, SYNTH, true)));
  } else {
    for (const f of fs.readdirSync(OUT)) {
      if (!f.startsWith("synth-") && f !== "manifest.json") {
        fs.unlinkSync(path.join(OUT, f));
      }
    }
    dims.push(...(await capture(browser, "full-390", 390, 844, FULL, true)));
    dims.push(...(await capture(browser, "full-1440", 1440, 900, FULL, true)));
    dims.push(...(await capture(browser, "full-768", 768, 1024, FULL_768, true)));
    dims.push(...(await capture(browser, "normal-390x844", 390, 844, NORMAL, false)));
    dims.push(...(await capture(browser, "normal-1440x900", 1440, 900, NORMAL, false)));
  }
} finally {
  await browser.close();
}

const existing = {
  mode: MODE,
  base: BASE,
  generatedAt: new Date().toISOString(),
  screenshots: fs.readdirSync(OUT).filter((f) => f.endsWith(".png")).sort(),
  dimensions: dims,
};
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(existing, null, 2));
console.log(MODE, "shots", existing.screenshots.length);
