/**
 * V1 visual convergence screenshots — 390×844 and 1440×900 only.
 * Run with: node docs/revamp/screenshots/v1-visual-convergence/capture.mjs
 * Requires a running server at BASE_URL (default http://localhost:3000).
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
  { slug: "programmes", path: "/programs" },
  { slug: "programme-detail", path: "/programs/functional-training" },
  { slug: "locations", path: "/locations" },
  { slug: "branch-detail", path: "/locations/airoli-sector-19" },
  { slug: "batch-availability", path: "/timetable" },
  { slug: "pricing", path: "/pricing" },
  { slug: "about", path: "/about" },
  { slug: "trial", path: "/trial" },
  { slug: "contact", path: "/contact" },
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
    const file = path.join(OUT, `${vp.name}_${route.slug}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("wrote", path.relative(process.cwd(), file));
  }
  await context.close();
}
await browser.close();
console.log("done");
