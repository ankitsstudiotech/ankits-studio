/**
 * Capture programme production pages for QA.
 * Usage: node docs/revamp/_capture-programmes-production.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const OUT = path.resolve("docs/revamp/screenshots/programmes-production");
fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const confirmed = [
  "functional-training",
  "zumba",
  "yoga",
  "adult-dance",
  "wedding-choreography",
  "home-personal-training",
  "online-training",
];

const legacy = ["strength-training", "personal-training", "kids-dance", "weight-loss-fitness"];

const browser = await chromium.launch();

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  await page.goto(`${BASE}/programs`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForSelector("#programmes-index-title", { timeout: 30000 });
  await page.screenshot({ path: path.join(OUT, `${vp.name}_programs_index.png`), fullPage: false });
  if (vp.name === "390x844" || vp.name === "1440x900") {
    await page.screenshot({ path: path.join(OUT, `${vp.name}_programs_index_full.png`), fullPage: true });
  }
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const slug of confirmed) {
    await page.goto(`${BASE}/programs/${slug}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForSelector("#programme-title", { timeout: 30000 });
    await page.screenshot({ path: path.join(OUT, `390x844_${slug}.png`), fullPage: false });
  }
  for (const slug of legacy) {
    await page.goto(`${BASE}/programs/${slug}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForSelector("#legacy-title", { timeout: 30000 });
    await page.screenshot({ path: path.join(OUT, `390x844_legacy_${slug}.png`), fullPage: false });
  }
  await context.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/programs`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.screenshot({ path: path.join(OUT, "390x844_programs_reduced_motion.png"), fullPage: false });
  await context.close();
}

await browser.close();
console.log(`Wrote ${OUT}`);
