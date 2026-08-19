/**
 * Stage 7 link crawl + redirect + console + overflow + metadata dump.
 * PLAYWRIGHT_BASE_URL=… node docs/revamp/_stage7-release-checks.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3707";
const INDEXABLE = [
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/programs/yoga",
  "/programs/zumba",
  "/programs/adult-dance",
  "/programs/wedding-choreography",
  "/programs/home-personal-training",
  "/programs/online-training",
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

const BAD_COPY =
  /\b(AI concept preview|ALLOW_MOCK|publication threshold|owner confirmed|evidence pending|Lorem ipsum|127\.0\.0\.1|localhost)\b/i;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const linkIssues = [];
const consoleErrors = [];
const overflow = [];
const networkFails = [];
const metadataDump = {};

page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push({ url: page.url(), text: msg.text() });
});
page.on("pageerror", (err) => consoleErrors.push({ url: page.url(), text: String(err) }));
page.on("response", (res) => {
  const u = res.url();
  if (!u.startsWith(BASE)) return;
  if (res.status() >= 400 && !u.includes("this-route-does-not-exist")) {
    networkFails.push({ url: u, status: res.status() });
  }
});

for (const route of INDEXABLE) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  const body = await page.locator("body").innerText();
  if (BAD_COPY.test(body)) linkIssues.push(`${route}: leak ${body.match(BAD_COPY)?.[0]}`);

  const ox = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (ox) overflow.push(route);

  const anchors = await page.locator("a[href]").evaluateAll((nodes) =>
    nodes.map((a) => ({
      href: a.getAttribute("href"),
      rel: a.getAttribute("rel"),
      target: a.getAttribute("target"),
    })),
  );
  for (const a of anchors) {
    if (!a.href) continue;
    if (a.href.startsWith("http") && a.href.includes("localhost")) {
      linkIssues.push(`${route}: localhost link ${a.href}`);
    }
    if (a.target === "_blank" && !(a.rel || "").includes("noopener")) {
      linkIssues.push(`${route}: target=_blank missing noopener (${a.href})`);
    }
    if (a.href.startsWith("/design-lab")) {
      linkIssues.push(`${route}: design-lab link`);
    }
  }

  if (["/", "/programs/functional-training", "/locations/airoli-sector-19", "/pricing"].includes(route)) {
    metadataDump[route] = await page.evaluate(() => {
      const pick = (sel) => document.querySelector(sel)?.getAttribute("content") || document.querySelector(sel)?.getAttribute("href") || null;
      return {
        title: document.title,
        description: pick('meta[name="description"]'),
        robots: pick('meta[name="robots"]'),
        canonical: pick('link[rel="canonical"]'),
        ogTitle: pick('meta[property="og:title"]'),
        ogImage: pick('meta[property="og:image"]'),
        twitterCard: pick('meta[name="twitter:card"]'),
      };
    });
  }
}

// Redirects
const redirects = {};
for (const [from, expectPath] of [
  ["/locations/airoli", "/locations/airoli-sector-19"],
  ["/book-a-free-trial", "/trial"],
]) {
  const res = await page.goto(BASE + from, { waitUntil: "domcontentloaded" });
  redirects[from] = {
    finalUrl: page.url(),
    status: res?.status() ?? null,
    ok: page.url().includes(expectPath),
  };
}

// robots + sitemap
const robotsText = await (await page.goto(BASE + "/robots.txt")).text();
const sitemapText = await (await page.goto(BASE + "/sitemap.xml")).text();

const headers = await page.evaluate(async (base) => {
  const r = await fetch(base + "/");
  return {
    nosniff: r.headers.get("x-content-type-options"),
    referrer: r.headers.get("referrer-policy"),
    frame: r.headers.get("x-frame-options"),
  };
}, BASE);

await browser.close();

const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  linkIssues,
  consoleErrors: consoleErrors.slice(0, 50),
  networkFails: [...new Map(networkFails.map((n) => [n.url, n])).values()].slice(0, 50),
  overflow,
  redirects,
  headers,
  robotsHasSitemap: /sitemap/i.test(robotsText) && !/localhost/i.test(robotsText),
  robotsDisallowsDesignLab: /design-lab/i.test(robotsText),
  sitemapHasTrainers: /\/trainers/.test(sitemapText),
  sitemapHasTransformations: /\/transformations/.test(sitemapText),
  sitemapHasLocalhost: /localhost|127\.0\.0\.1/.test(sitemapText),
  metadataDump,
};

fs.mkdirSync("docs/audits", { recursive: true });
fs.mkdirSync("docs/seo", { recursive: true });

const crawlMd = `# Stage 7 — Link crawl summary

Base: \`${BASE}\`  
Generated: ${report.generatedAt}

## Result

- Link / leak issues: **${linkIssues.length}**
- Console errors: **${consoleErrors.length}**
- Internal network failures: **${report.networkFails.length}**
- Horizontal overflow routes: **${overflow.length ? overflow.join(", ") : "none"}**
- Redirects: ${Object.entries(redirects)
  .map(([k, v]) => `${k} → ${v.ok ? "OK" : "FAIL"} (${v.finalUrl})`)
  .join("; ")}
- Security headers present: nosniff=${headers.nosniff}, referrer=${headers.referrer}, frame=${headers.frame}
- robots sitemap OK: ${report.robotsHasSitemap}; design-lab disallow: ${report.robotsDisallowsDesignLab}
- sitemap excludes trainers/transformations: ${!report.sitemapHasTrainers && !report.sitemapHasTransformations}
- sitemap no localhost: ${!report.sitemapHasLocalhost}

${linkIssues.length || consoleErrors.length || overflow.length || report.networkFails.length ? "## Issues\n\n" + JSON.stringify({ linkIssues, consoleErrors: consoleErrors.slice(0, 20), overflow, networkFails: report.networkFails }, null, 2) : "No blocking crawl issues recorded."}
`;

fs.writeFileSync("docs/audits/STAGE-7-LINK-CRAWL.md", crawlMd);
fs.writeFileSync("docs/seo/STAGE-7-METADATA-EVIDENCE.json", JSON.stringify(metadataDump, null, 2));
fs.writeFileSync("docs/audits/STAGE-7-RELEASE-CHECKS.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ linkIssues: linkIssues.length, consoleErrors: consoleErrors.length, overflow, redirects }, null, 2));
if (linkIssues.length || overflow.length) process.exitCode = 1;
