/**
 * Stage 8 — production release crawl (synthetic=false).
 * PLAYWRIGHT_BASE_URL=… node docs/revamp/_stage8-release-crawl.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3808";
const OUT = path.resolve("docs/revamp/STAGE-8-RELEASE-CRAWL.json");

const PUBLIC = [
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
  "/locations",
  "/locations/airoli-sector-19",
  "/locations/airoli-sector-8",
  "/locations/ghansoli",
  "/locations/thane",
  "/timetable",
  "/pricing",
  "/trial",
  "/contact",
  "/privacy-policy",
  "/terms",
];

const NOINDEX = ["/trainers", "/transformations", "/blog", "/design-lab"];
const REDIRECTS = ["/locations/airoli", "/book-a-free-trial"];
const NOT_FOUND = [
  "/programs/not-a-real-programme",
  "/locations/not-a-branch",
  "/blog/sample-post",
  "/trainers/not-a-trainer",
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  colorScheme: "dark",
});
const page = await ctx.newPage();

const results = [];
const consoleErrors = [];
const networkFailures = [];

page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push({ text: msg.text(), url: page.url() });
});
page.on("requestfailed", (req) => {
  networkFailures.push({ url: req.url(), error: req.failure()?.errorText, page: page.url() });
});

async function inspect(pathname, expect) {
  const consoleBefore = consoleErrors.length;
  const netBefore = networkFailures.length;
  const res = await page.goto(BASE + pathname, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page.waitForTimeout(400);
  const status = res?.status() ?? null;
  const finalUrl = page.url();
  const data = await page.evaluate(() => {
    const robots =
      document.querySelector('meta[name="robots"]')?.getAttribute("content") || null;
    const canonical =
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") || null;
    const h1 = document.querySelector("h1")?.textContent?.trim() || null;
    const title = document.title;
    const bodyText = document.body?.innerText || "";
    const html = document.documentElement.outerHTML;
    const overflowX = document.documentElement.scrollWidth > window.innerWidth + 1;
    const mockBanner = !!document.querySelector("[data-mock-banner], .mock-mode, #mock-mode-indicator");
    return {
      title,
      h1,
      robots,
      canonical,
      overflowX,
      hasAiConcept: /AI concept preview/i.test(bodyText) || /AI concept preview/i.test(html),
      hasSyntheticUrl: /synthetic-preview|synthetic\//i.test(html),
      hasMockLeak: /ALLOW_MOCK|mock content|unpublished mock/i.test(bodyText),
      mockBanner,
    };
  });
  results.push({
    path: pathname,
    expect,
    status,
    finalUrl,
    ...data,
    consoleErrors: consoleErrors.slice(consoleBefore),
    networkFailures: networkFailures
      .slice(netBefore)
      .filter((n) => !n.url.includes("favicon")),
  });
}

for (const p of PUBLIC) await inspect(p, "public-200");
for (const p of NOINDEX) await inspect(p, "noindex-200");
for (const p of REDIRECTS) await inspect(p, "redirect");
for (const p of NOT_FOUND) await inspect(p, "404");

// robots + sitemap
for (const p of ["/robots.txt", "/sitemap.xml"]) {
  const res = await page.goto(BASE + p, { waitUntil: "domcontentloaded", timeout: 30000 });
  const text = await page.locator("body").innerText().catch(() => "");
  results.push({
    path: p,
    expect: "meta",
    status: res?.status() ?? null,
    finalUrl: page.url(),
    snippet: text.slice(0, 500),
    hasLocalhost: /localhost|127\.0\.0\.1/i.test(text),
  });
}

const summary = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  headSha: process.env.HEAD_SHA || "unknown",
  env: {
    NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA: process.env.NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA ?? "unset",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "unset",
    ALLOW_MOCK_PUBLISH: process.env.ALLOW_MOCK_PUBLISH ?? "unset",
    ANKITS_PRODUCTION_RELEASE: process.env.ANKITS_PRODUCTION_RELEASE ?? "unset",
  },
  totals: {
    routes: results.length,
    publicAiConcept: results.filter((r) => r.hasAiConcept).length,
    publicSyntheticUrl: results.filter((r) => r.hasSyntheticUrl).length,
    overflowX: results.filter((r) => r.overflowX).length,
    consoleErrorEvents: consoleErrors.length,
    networkFailureEvents: networkFailures.filter((n) => !n.url.includes("favicon")).length,
  },
  results,
};

fs.writeFileSync(OUT, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary.totals, null, 2));
await browser.close();
