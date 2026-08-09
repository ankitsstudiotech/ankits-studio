import { chromium } from "@playwright/test";

const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3607";

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`${base}/about`, { waitUntil: "networkidle" });
const aboutMarkers = await page.locator("text=AI concept preview").count();
const aboutBody = await page.locator("body").innerText();
console.log("about concept markers", aboutMarkers);
console.log("about has 15+", /15\+/.test(aboutBody));
console.log("about has provenance UI", /evidence pending|owner confirmed|publication threshold/i.test(aboutBody));

await page.goto(`${base}/`, { waitUntil: "networkidle" });
const homeMarkers = await page.locator("text=AI concept preview").count();
const trust = await page.locator('[aria-label="Studio facts"]').innerText();
console.log("home concept markers", homeMarkers);
console.log("trust rail", trust.replace(/\s+/g, " ").trim());

await page.goto(`${base}/locations/airoli-sector-19`, { waitUntil: "networkidle" });
const maps = page.locator('a[href*="maps.app.goo.gl"]');
const mapsCount = await maps.count();
const first = mapsCount ? await maps.first().getAttribute("href") : null;
const rel = mapsCount ? await maps.first().getAttribute("rel") : null;
const target = mapsCount ? await maps.first().getAttribute("target") : null;
console.log("branch maps links", mapsCount, first, { rel, target });

await browser.close();
