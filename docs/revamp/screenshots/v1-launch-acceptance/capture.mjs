/**
 * V1 launch-acceptance screenshots — 390×844 and 1440×900.
 * Requires production server without ALLOW_MOCK_PUBLISH (real V1 gate).
 * Run: node docs/revamp/screenshots/v1-launch-acceptance/capture.mjs
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = __dirname;

const VIEWPORTS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "1440x900", width: 1440, height: 900 },
];

const ROUTES = [
  { slug: "home", path: "/" },
  { slug: "about", path: "/about" },
  { slug: "programmes", path: "/programs" },
  { slug: "functional-training", path: "/programs/functional-training" },
  { slug: "locations", path: "/locations" },
  { slug: "airoli-sector-19", path: "/locations/airoli-sector-19" },
  { slug: "batch-availability", path: "/timetable" },
  { slug: "pricing", path: "/pricing" },
  { slug: "contact", path: "/contact" },
  { slug: "trial", path: "/trial" },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  for (const route of ROUTES) {
    await page.goto(new URL(route.path, BASE).href, { waitUntil: "networkidle" });
    const banner = await page.locator('[role="status"]').filter({ hasText: /preview/i }).count();
    if (banner > 0) {
      console.warn("WARN: preview banner visible on", route.path, vp.name);
    }
    const file = path.join(OUT, `${vp.name}_${route.slug}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("wrote", path.relative(process.cwd(), file));
  }
  await context.close();
}
await browser.close();
console.log("done");
