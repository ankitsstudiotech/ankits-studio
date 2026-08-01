/**
 * Phase 1 incumbent screenshot capture — docs/revamp only.
 * Usage: node docs/revamp/_capture-before.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const OUT = path.resolve("docs/revamp/screenshots/before");
fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const routes = [
  "/",
  "/programs",
  "/programs/yoga",
  "/programs/strength-training",
  "/locations",
  "/locations/airoli",
  "/locations/thane",
  "/about",
  "/trainers",
  "/timetable",
  "/pricing",
  "/transformations",
  "/trial",
  "/contact",
];

function slug(route) {
  return route.replace(/^\//, "").replace(/\//g, "_") || "home";
}

const browser = await chromium.launch();
const page = await browser.newPage();

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  for (const route of routes) {
    const url = `${BASE}${route}`;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(400);
      const file = path.join(OUT, `${vp.name}_${slug(route)}.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log("ok", vp.name, route);
    } catch (err) {
      console.error("fail", vp.name, route, err.message);
    }
  }
}

// Special probes at 390
await page.setViewportSize({ width: 390, height: 844 });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(OUT, "390x844_home_reduced_motion.png") });
await page.emulateMedia({ reducedMotion: "no-preference" });

await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.screenshot({ path: path.join(OUT, "390x844_home_keyboard_focus.png") });

await browser.close();
console.log("done", OUT);
