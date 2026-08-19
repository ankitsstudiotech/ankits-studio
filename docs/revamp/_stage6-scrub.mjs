import { chromium } from "@playwright/test";

const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3608";
const routes = [
  "/",
  "/about",
  "/locations",
  "/locations/airoli-sector-19",
  "/pricing",
  "/trial",
  "/contact",
  "/programs/home-personal-training",
  "/programs/online-training",
  "/programs/wedding-choreography",
  "/trainers",
  "/transformations",
];

const BAD =
  /owner[- ]confirmed|evidence[- ]pending|publication threshold|AI concept preview|data status|provenance|mock preview|AggregateRating|5-star|trusted by thousands/i;

const browser = await chromium.launch();
const page = await browser.newPage();
const fails = [];

for (const route of routes) {
  await page.goto(base + route, { waitUntil: "domcontentloaded" });
  const text = await page.locator("body").innerText();
  const bad = text.match(BAD);
  if (bad) fails.push(`${route}: ${bad[0]}`);
  if (route.startsWith("/locations/") || route === "/contact" || route === "/locations") {
    const maps = await page.locator('a[href*="maps.app.goo.gl"]').count();
    if (maps < 1 && route !== "/locations") fails.push(`${route}: missing maps link`);
  }
}

console.log(fails.length ? `FAIL\n${fails.join("\n")}` : "PASS customer-facing scrub + maps");
await browser.close();
process.exit(fails.length ? 1 : 0);
