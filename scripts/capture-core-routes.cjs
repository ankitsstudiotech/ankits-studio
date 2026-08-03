const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const out = path.join("docs/revamp/screenshots/core-routes-system-propagation");
const base = "http://localhost:3000";
fs.mkdirSync(out, { recursive: true });

const routes = [
  ["about", "/about"],
  ["programs", "/programs"],
  ["program-functional-training", "/programs/functional-training"],
  ["program-yoga", "/programs/yoga"],
  ["program-home-personal-training", "/programs/home-personal-training"],
  ["locations", "/locations"],
  ["location-airoli-sector-19", "/locations/airoli-sector-19"],
  ["timetable", "/timetable"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
  ["contact", "/contact"],
];

async function shot(browser, name, url, w, h, full) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(base + url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, name), fullPage: full });
  await page.close();
  console.log("ok", name);
}

(async () => {
  const browser = await chromium.launch();
  const prefix = process.argv[2] || "before";
  for (const [slug, url] of routes) {
    await shot(browser, `${prefix}-390-${slug}.png`, url, 390, 844, true);
    await shot(browser, `${prefix}-1440-${slug}.png`, url, 1440, 900, true);
  }
  // representative 768
  for (const [slug, url] of [
    ["about", "/about"],
    ["programs", "/programs"],
    ["program-functional-training", "/programs/functional-training"],
    ["locations", "/locations"],
    ["location-airoli-sector-19", "/locations/airoli-sector-19"],
    ["timetable", "/timetable"],
    ["pricing", "/pricing"],
    ["trial", "/trial"],
    ["contact", "/contact"],
  ]) {
    await shot(browser, `${prefix}-768-${slug}.png`, url, 768, 1024, false);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
