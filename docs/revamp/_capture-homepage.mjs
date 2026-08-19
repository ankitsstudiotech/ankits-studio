/**
 * Capture production homepage + frozen Revamp B for comparison.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const out = path.resolve("docs/revamp/screenshots/studio-pulse-homepage");
fs.mkdirSync(out, { recursive: true });

const viewports = [
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("h1", { timeout: 30000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, `${vp.name}_home.png`), fullPage: false });
  await page.screenshot({ path: path.join(out, `${vp.name}_home_full.png`), fullPage: true });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/design-lab/revamp-b`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("[data-design-lab-prototype='b']", { timeout: 30000 });
  await page.screenshot({ path: path.join(out, "1440x900_frozen_b.png"), fullPage: false });
  await context.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("h1", { timeout: 30000 });
  await page.screenshot({ path: path.join(out, "390x844_home_reduced_motion.png"), fullPage: false });
  await context.close();
}

await browser.close();
console.log("Wrote docs/revamp/screenshots/studio-pulse-homepage/");
