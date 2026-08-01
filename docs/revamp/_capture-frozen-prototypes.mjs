/**
 * Capture frozen design-lab prototype baselines after isolation.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const viewports = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const prototypes = [
  { path: "/design-lab/revamp-a", dir: "frozen-a" },
  { path: "/design-lab/revamp-b", dir: "frozen-b" },
  { path: "/design-lab/revamp-c", dir: "frozen-c" },
];

const browser = await chromium.launch();

for (const proto of prototypes) {
  const out = path.resolve(`docs/revamp/screenshots/${proto.dir}`);
  fs.mkdirSync(out, { recursive: true });

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();
    await page.goto(`${BASE}${proto.path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector("[data-frozen-prototype='true']", { timeout: 30000 });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(out, `${vp.name}_hero.png`),
      fullPage: false,
    });
    await page.screenshot({
      path: path.join(out, `${vp.name}_full.png`),
      fullPage: true,
    });
    await context.close();
  }
}

await browser.close();
console.log("Frozen screenshots written under docs/revamp/screenshots/frozen-{a,b,c}/");
