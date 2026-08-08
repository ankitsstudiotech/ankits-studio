/**
 * Prompt 4 local QA probe — copy leakage, sticky, SEO, redirects, WhatsApp, maps.
 * Does not send messages. BASE_URL required.
 */
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3485";
const OUT = path.join("docs/revamp/screenshots", "final-qa-probe");
fs.mkdirSync(OUT, { recursive: true });

const LEAK = [
  /Mock preview/i,
  /Demonstration mode/i,
  /owner-confirmed/i,
  /evidence pending/i,
  /verified details/i,
  /publication gate/i,
  /taxonomy review/i,
  /printable address/i,
  /\binvented\b/i,
  /\bfake\b/i,
  /placeholder/i,
  /counsel-certified/i,
  /class-by-class rows/i,
  /open neighbourhood studio/i,
  /Illustrative member/i,
];

const ROUTES = [
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
  "/trainers",
  "/transformations",
  "/blog",
  "/programs/strength-training",
  "/programs/personal-training",
  "/programs/kids-dance",
  "/programs/weight-loss-fitness",
  "/this-page-does-not-exist",
];

const ELIGIBLE = new Set([
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/locations",
  "/locations/airoli-sector-19",
  "/timetable",
  "/pricing",
  "/contact",
  "/trial",
]);

const EXCLUDED = [
  "/privacy-policy",
  "/terms",
  "/trainers",
  "/transformations",
  "/blog",
  "/programs/personal-training",
  "/this-page-does-not-exist",
];

async function meta(page) {
  return page.evaluate(() => {
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") || "";
    const canonical =
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
    const title = document.title;
    const description =
      document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => s.textContent || "",
    );
    return { robots, canonical, title, description, jsonLd };
  });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const report = {
    base: BASE,
    generatedAt: new Date().toISOString(),
    leaks: [],
    seo: [],
    sticky: { eligible: [], excluded: [] },
    redirects: [],
    samples404: [],
    conversion: {},
    issues: [],
  };

  for (const route of ROUTES) {
    const res = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(300);
    const text = await page.locator("body").innerText();
    for (const re of LEAK) {
      if (re.test(text)) {
        report.leaks.push({ route, pattern: String(re), snippet: text.match(re)?.[0] });
      }
    }
    const m = await meta(page);
    const sticky = await page.locator("[data-sticky-cta-eligible]").count();
    const hasPad = await page.evaluate(() =>
      document.body.classList.contains("has-sticky-cta"),
    );
    report.seo.push({
      route,
      status: res?.status() ?? null,
      ...m,
      sticky,
      hasPad,
    });
  }

  for (const route of ELIGIBLE) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const sticky = await page.locator("[data-sticky-cta-eligible]").count();
    const hasPad = await page.evaluate(() =>
      document.body.classList.contains("has-sticky-cta"),
    );
    report.sticky.eligible.push({ route, sticky, hasPad, pass: sticky === 1 && hasPad });
  }
  for (const route of EXCLUDED) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const sticky = await page.locator("[data-sticky-cta-eligible]").count();
    const hasPad = await page.evaluate(() =>
      document.body.classList.contains("has-sticky-cta"),
    );
    report.sticky.excluded.push({
      route,
      sticky,
      hasPad,
      pass: sticky === 0 && !hasPad,
    });
  }

  for (const [from, expectPath] of [
    ["/book-a-free-trial", "/trial"],
    ["/locations/airoli", "/locations/airoli-sector-19"],
  ]) {
    const res = await page.goto(BASE + from, { waitUntil: "networkidle" });
    const url = page.url();
    report.redirects.push({
      from,
      finalUrl: url,
      status: res?.status(),
      pass: url.includes(expectPath),
    });
  }

  for (const slug of [
    "sample-starting-with-strength",
    "sample-finding-your-first-class",
  ]) {
    const res = await page.goto(BASE + `/blog/${slug}`, { waitUntil: "domcontentloaded" });
    report.samples404.push({
      route: `/blog/${slug}`,
      status: res?.status(),
      pass: res?.status() === 404,
    });
  }

  // Conversion links
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const homeWa = await page.locator('a[href*="wa.me"], a[href*="whatsapp"]').first().getAttribute("href");
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  const tel = await page.locator('a[href^="tel:"]').first().getAttribute("href");
  const mail = await page.locator('a[href^="mailto:"]').first().getAttribute("href");
  await page.goto(BASE + "/locations/airoli-sector-19", { waitUntil: "networkidle" });
  const maps = await page.locator('a[href*="maps"], a[href*="google.com/maps"]').allAttributeValues?.("href");
  const mapHrefs = await page.$$eval('a[href*="maps.google"], a[href*="google.com/maps"], a[href*="maps.app"]', (els) =>
    els.map((e) => e.getAttribute("href")),
  );
  await page.goto(BASE + "/trial", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const trialWa = await page.locator("#trial-whatsapp-cta, a[href*='wa.me']").first().getAttribute("href");

  report.conversion = {
    homeWhatsApp: homeWa,
    trialWhatsApp: trialWa,
    tel,
    mail,
    maps: mapHrefs,
    phoneOk: /919372402074/.test(String(homeWa || "")) || /919372402074/.test(String(trialWa || "")),
    telOk: tel === "tel:+919372402074",
    mailOk: mail === "mailto:ankitsstudio5@gmail.com",
  };

  // All four maps
  const mapChecks = [];
  for (const slug of ["airoli-sector-19", "airoli-sector-8", "ghansoli", "thane"]) {
    await page.goto(BASE + `/locations/${slug}`, { waitUntil: "networkidle" });
    const hrefs = await page.$$eval(
      'a[href*="maps"], a[href*="google.com/maps"], a[href*="goo.gl"]',
      (els) => els.map((e) => e.getAttribute("href")),
    );
    mapChecks.push({ slug, hrefs, pass: hrefs.length > 0 });
  }
  report.conversion.branchMaps = mapChecks;

  // Sitemap / robots
  const robotsRes = await page.goto(BASE + "/robots.txt");
  const robotsText = await page.locator("body").innerText();
  const smRes = await page.goto(BASE + "/sitemap.xml");
  const smText = await page.locator("body").innerText();
  report.seoMeta = {
    robotsStatus: robotsRes?.status(),
    sitemapStatus: smRes?.status(),
    sitemapHasTrainers: /\/trainers/.test(smText),
    sitemapHasBlog: /\/blog/.test(smText),
    sitemapHasTransformations: /\/transformations/.test(smText),
    robotsText: robotsText.slice(0, 500),
  };

  // Review schema
  for (const route of ["/", "/locations/airoli-sector-19", "/programs/functional-training"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const m = await meta(page);
    const joined = m.jsonLd.join("\n");
    if (/AggregateRating|\"@type\"\s*:\s*\"Review\"/i.test(joined)) {
      report.issues.push({ type: "review-schema", route });
    }
  }

  const stickyEligFail = report.sticky.eligible.filter((x) => !x.pass);
  const stickyExFail = report.sticky.excluded.filter((x) => !x.pass);
  if (report.leaks.length) report.issues.push({ type: "copy-leak", count: report.leaks.length });
  if (stickyEligFail.length) report.issues.push({ type: "sticky-eligible", items: stickyEligFail });
  if (stickyExFail.length) report.issues.push({ type: "sticky-excluded", items: stickyExFail });
  if (!report.conversion.phoneOk) report.issues.push({ type: "whatsapp-phone" });
  if (!report.conversion.telOk) report.issues.push({ type: "tel" });
  if (!report.conversion.mailOk) report.issues.push({ type: "mailto" });
  if (report.samples404.some((s) => !s.pass)) report.issues.push({ type: "sample-404" });
  if (report.seoMeta.sitemapHasTrainers || report.seoMeta.sitemapHasBlog || report.seoMeta.sitemapHasTransformations) {
    report.issues.push({ type: "sitemap-withheld" });
  }

  fs.writeFileSync(path.join(OUT, "probe-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ issues: report.issues, leakCount: report.leaks.length, stickyEligFail: stickyEligFail.length, stickyExFail: stickyExFail.length }, null, 2));
  await browser.close();
  if (report.issues.length) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
