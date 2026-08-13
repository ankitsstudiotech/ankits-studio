/**
 * Live Vercel screenshots after production deploy.
 * PLAYWRIGHT_BASE_URL=https://ankits-studio.vercel.app node docs/revamp/_capture-live-owner-final-2026-08-13.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "https://ankits-studio.vercel.app";
const OUT = path.resolve("docs/revamp/screenshots/live-owner-final-2026-08-13");
fs.mkdirSync(OUT, { recursive: true });

const routes = [
  ["home", "/"],
  ["programs", "/programs"],
  ["corporate-wellness", "/programs/corporate-wellness"],
  ["locations", "/locations"],
  ["trial", "/trial"],
];

const browser = await chromium.launch({ headless: true });
async function shot(route, name, w, h, full) {
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    colorScheme: "dark",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const res = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page
    .waitForFunction(
      () => {
        const visible = [...document.images].filter((img) => {
          const r = img.getBoundingClientRect();
          return r.width > 40 && r.height > 40 && r.bottom > 0 && r.top < window.innerHeight + 400;
        });
        return visible.length === 0 || visible.every((img) => img.complete && img.naturalWidth > 0);
      },
      { timeout: 15_000 },
    )
    .catch(() => {});
  await page.waitForTimeout(250);
  const file = full
    ? `full-${w}-${name}.png`
    : `viewport-${w}x${h}-${name}.png`;
  await page.screenshot({ path: path.join(OUT, file), fullPage: full });
  await context.close();
  console.log(res?.status(), file);
}

for (const [name, route] of routes) {
  await shot(route, name, 390, 844, true);
  await shot(route, name, 1440, 900, true);
}
await shot("/", "home", 390, 844, false);
await shot("/", "home", 1440, 900, false);

await browser.close();
console.log("live shots", OUT);
