/**
 * Final release-candidate screenshots from a production server.
 * Usage:
 *   PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 node docs/revamp/_capture-final-release-candidate-2026-08-13.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3100";
const OUT = path.resolve("docs/revamp/screenshots/final-release-candidate-2026-08-13");

fs.mkdirSync(OUT, { recursive: true });

const PROGRAMMES = [
  "functional-training",
  "zumba",
  "yoga",
  "adult-dance",
  "wedding-choreography",
  "home-personal-training",
  "online-training",
  "corporate-wellness",
];
const BRANCHES = ["airoli-sector-19", "airoli-sector-8", "ghansoli", "thane"];

const FULL_390 = [
  "/",
  "/about",
  "/programs",
  ...PROGRAMMES.map((s) => `/programs/${s}`),
  "/locations",
  ...BRANCHES.map((s) => `/locations/${s}`),
  "/pricing",
  "/timetable",
  "/trial",
  "/contact",
  "/privacy-policy",
  "/terms",
];

const FULL_768 = [
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/programs/yoga",
  "/programs/adult-dance",
  "/programs/corporate-wellness",
  "/locations",
  "/locations/airoli-sector-19",
  "/pricing",
  "/timetable",
  "/trial",
  "/contact",
];

const FULL_1440 = FULL_390;

const FULL_1920 = [
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/programs/yoga",
  "/programs/adult-dance",
  "/programs/corporate-wellness",
  "/locations",
  "/pricing",
  "/trial",
];

const VIEWPORTS = [
  { name: "home", path: "/" },
  { name: "programs", path: "/programs" },
  { name: "corporate-wellness", path: "/programs/corporate-wellness" },
  { name: "locations", path: "/locations" },
  { name: "trial", path: "/trial" },
];

function slug(route) {
  if (route === "/") return "home";
  return route.replace(/^\//, "").replaceAll("/", "--");
}

const browser = await chromium.launch({ headless: true });
const leaks = [];

async function shot(route, width, height, file, fullPage) {
  const context = await browser.newContext({
    viewport: { width, height },
    colorScheme: "dark",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const response = await page.goto(BASE + route, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.locator("main").waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
  await page
    .waitForFunction(
      () => {
        const visible = [...document.images].filter((img) => {
          const r = img.getBoundingClientRect();
          return r.width > 40 && r.height > 40 && r.bottom > 0 && r.top < window.innerHeight + 400;
        });
        return visible.length === 0 || visible.every((img) => img.complete && img.naturalWidth > 0);
      },
      { timeout: 12_000 },
    )
    .catch(() => {});
  await page.waitForTimeout(200);
  const body = await page.locator("body").innerText();
  if (/Development preview|Mock preview|Demonstration mode|AI concept preview/i.test(body)) {
    leaks.push(`${file} ${route}`);
  }
  if (!response?.ok() && response?.status() !== 304) {
    leaks.push(`HTTP ${response?.status()} ${route} -> ${file}`);
  }
  await page.screenshot({ path: path.join(OUT, file), fullPage });
  await context.close();
  console.log("wrote", file);
}

for (const route of FULL_390) {
  await shot(route, 390, 844, `full-390-${slug(route)}.png`, true);
}
for (const route of FULL_768) {
  await shot(route, 768, 1024, `full-768-${slug(route)}.png`, true);
}
for (const route of FULL_1440) {
  await shot(route, 1440, 900, `full-1440-${slug(route)}.png`, true);
}
for (const route of FULL_1920) {
  await shot(route, 1920, 1080, `full-1920-${slug(route)}.png`, true);
}

const vp = [
  [390, 844],
  [768, 1024],
  [1440, 900],
  [1920, 1080],
];
for (const [w, h] of vp) {
  for (const item of VIEWPORTS) {
    await shot(item.path, w, h, `viewport-${w}x${h}-${item.name}.png`, false);
  }
}

fs.writeFileSync(
  path.join(OUT, "manifest.json"),
  JSON.stringify({ base: BASE, leaks, capturedAt: new Date().toISOString() }, null, 2),
);

await browser.close();
if (leaks.length) {
  console.error("LEAKS", leaks);
  process.exit(1);
}
console.log("done", OUT);
