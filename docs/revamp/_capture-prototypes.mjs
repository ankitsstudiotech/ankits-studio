/**
 * Capture design-lab revamp prototype screenshots. Ephemeral helper.
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
  { id: "a", path: "/design-lab/revamp-a", dir: "prototype-a" },
  { id: "b", path: "/design-lab/revamp-b", dir: "prototype-b" },
  { id: "c", path: "/design-lab/revamp-c", dir: "prototype-c" },
];

const browser = await chromium.launch();

for (const proto of prototypes) {
  const out = path.resolve(`docs/revamp/screenshots/${proto.dir}`);
  fs.mkdirSync(out, { recursive: true });

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    await page.goto(`${BASE}${proto.path}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(400);
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

  // Reduced-motion pass at mobile
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${BASE}${proto.path}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(out, `390x844_reduced_motion.png`),
      fullPage: false,
    });
    await context.close();
  }
}

await browser.close();
console.log("Prototype screenshots written under docs/revamp/screenshots/prototype-{a,b,c}/");
