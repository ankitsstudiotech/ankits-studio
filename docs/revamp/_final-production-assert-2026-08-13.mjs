/**
 * Final production release assertion against a running production server.
 * PLAYWRIGHT_BASE_URL=http://localhost:3100 node docs/revamp/_final-production-assert-2026-08-13.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3100";
const OUT = path.resolve("docs/revamp/final-production-assert-2026-08-13.json");

const INDEXABLE = [
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/programs/home-personal-training",
  "/programs/online-training",
  "/programs/zumba",
  "/programs/yoga",
  "/programs/adult-dance",
  "/programs/wedding-choreography",
  "/programs/corporate-wellness",
  "/locations",
  "/locations/airoli-sector-19",
  "/locations/airoli-sector-8",
  "/locations/ghansoli",
  "/locations/thane",
  "/pricing",
  "/timetable",
  "/trial",
  "/contact",
  "/privacy-policy",
  "/terms",
];

const WITHHELD = ["/trainers", "/transformations", "/blog"];
const DESIGN_LAB = ["/design-lab/revamp-a", "/design-lab/revamp-b", "/design-lab/revamp-c"];
const LEGACY = [
  "/programs/strength-training",
  "/programs/personal-training",
  "/programs/kids-dance",
  "/programs/weight-loss-fitness",
];
const NOT_FOUND = [
  "/programs/this-is-not-a-programme",
  "/locations/this-is-not-a-branch",
  "/trainers/this-is-not-a-trainer",
  "/blog/sample-starting-with-strength",
];

const LEAK =
  /Development preview|Mock preview|Demonstration mode|AI concept preview|Illustrative member|Illustrative transformation|localhost|127\.0\.0\.1/i;

const issues = [];
const notes = [];

async function fetchMeta(url) {
  const res = await fetch(url, { redirect: "manual" });
  const html = await res.text();
  const robots = html.match(/<meta[^>]+name="robots"[^>]*>/i)?.[0] ?? "";
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]*>/i)?.[0] ?? "";
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "";
  return { status: res.status, robots, canonical, title, html, location: res.headers.get("location") };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const consoleErrors = [];
const failedAssets = [];

page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push({ url: page.url(), text: msg.text() });
});
page.on("pageerror", (err) => consoleErrors.push({ url: page.url(), text: String(err) }));
page.on("response", (res) => {
  const type = res.request().resourceType();
  if (["image", "stylesheet", "font", "script"].includes(type) && res.status() >= 400) {
    failedAssets.push({ url: res.url(), status: res.status(), type, page: page.url() });
  }
});

for (const route of INDEXABLE) {
  const meta = await fetchMeta(BASE + route);
  if (meta.status !== 200) issues.push(`${route} HTTP ${meta.status}`);
  if (/noindex/i.test(meta.robots)) issues.push(`${route} noindex`);
  if (!meta.canonical.includes("https://ankits-studio.vercel.app")) {
    issues.push(`${route} canonical ${meta.canonical}`);
  }
  if (LEAK.test(meta.html) && !/AI-generated illustrative imagery/i.test(meta.html.match(LEAK)?.[0] ?? "")) {
    const hit = meta.html.match(LEAK)?.[0];
    issues.push(`${route} leak ${hit}`);
  }
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60_000 });
  const body = await page.locator("body").innerText();
  if (LEAK.test(body)) issues.push(`${route} body leak ${body.match(LEAK)?.[0]}`);
}

for (const route of WITHHELD) {
  const meta = await fetchMeta(BASE + route);
  if (meta.status !== 200) issues.push(`${route} expected 200 noindex, got ${meta.status}`);
  if (!/noindex/i.test(meta.robots)) issues.push(`${route} missing noindex`);
}

for (const route of DESIGN_LAB) {
  const meta = await fetchMeta(BASE + route);
  if (meta.status !== 200) issues.push(`${route} expected frozen 200, got ${meta.status}`);
  if (!/noindex/i.test(meta.robots) || !/nofollow/i.test(meta.robots)) {
    issues.push(`${route} robots ${meta.robots}`);
  }
}

for (const route of LEGACY) {
  const meta = await fetchMeta(BASE + route);
  if (meta.status !== 200) issues.push(`${route} expected 200 noindex notice, got ${meta.status}`);
  if (!/noindex/i.test(meta.robots)) issues.push(`${route} missing noindex`);
}

for (const route of NOT_FOUND) {
  const meta = await fetchMeta(BASE + route);
  if (meta.status !== 404) issues.push(`${route} expected 404, got ${meta.status}`);
}

const redirectChecks = [
  ["/book-a-free-trial", "/trial"],
  ["/locations/airoli", "/locations/airoli-sector-19"],
];
const redirects = {};
for (const [from, dest] of redirectChecks) {
  const res = await fetch(BASE + from, { redirect: "manual" });
  const location = res.headers.get("location") || "";
  redirects[from] = { status: res.status, location };
  if (![308, 301].includes(res.status)) issues.push(`${from} status ${res.status}`);
  if (!location.endsWith(dest) && location !== dest) issues.push(`${from} -> ${location}, expected ${dest}`);
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
const google = await page.locator("#google-reviews").innerText();
if (!/Reviews on Google/i.test(google)) issues.push("home missing Reviews on Google");
if (/What members say/i.test(google)) issues.push("home fallback still says What members say");
if (/★|⭐/.test(google)) issues.push("home fallback shows stars");

await page.goto(BASE + "/programs/corporate-wellness", { waitUntil: "domcontentloaded" });
const sticky = page.locator("[data-sticky-cta-intent='service-enquiry']");
if ((await sticky.count()) !== 1) issues.push("corporate sticky missing");
else {
  const text = await sticky.innerText();
  if (!/For teams/i.test(text) || !/Enquire on WhatsApp/i.test(text) || /trial/i.test(text)) {
    issues.push(`corporate sticky copy: ${text}`);
  }
}

const robotsText = await (await fetch(BASE + "/robots.txt")).text();
const sitemapText = await (await fetch(BASE + "/sitemap.xml")).text();
if (!robotsText.includes("https://ankits-studio.vercel.app/sitemap.xml")) {
  issues.push(`robots sitemap ${robotsText}`);
}
if (/Disallow: \//.test(robotsText) && !/Allow: \//.test(robotsText)) {
  issues.push("robots globally disallow");
}
if (/localhost|127\.0\.0\.1/.test(robotsText) || /localhost|127\.0\.0\.1/.test(sitemapText)) {
  issues.push("robots/sitemap localhost");
}
for (const extra of ["/trainers", "/transformations", "/blog", "/design-lab"]) {
  if (sitemapText.includes(extra)) issues.push(`sitemap contains ${extra}`);
}
for (const required of INDEXABLE) {
  const abs = `https://ankits-studio.vercel.app${required === "/" ? "" : required}`;
  if (!sitemapText.includes(abs)) issues.push(`sitemap missing ${required}`);
}

await browser.close();

const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  indexableCount: INDEXABLE.length,
  issues,
  notes,
  redirects,
  consoleErrors: consoleErrors.slice(0, 40),
  failedAssets: failedAssets.slice(0, 40),
  robotsSnippet: robotsText.slice(0, 500),
  sitemapLength: sitemapText.length,
};

fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (issues.length || failedAssets.length || consoleErrors.length) {
  process.exit(1);
}
console.log("PASS", OUT);
