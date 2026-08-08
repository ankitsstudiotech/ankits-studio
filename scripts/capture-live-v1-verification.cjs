/**
 * Prompt 4 — LIVE production visual verification.
 * deviceScaleFactor: 1 · against ankits-studio.vercel.app
 */
const { chromium } = require("@playwright/test");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "https://ankits-studio.vercel.app";
const HEAD =
  process.env.HEAD_SHA ||
  require("child_process").execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
const HEAD_SHORT = HEAD.slice(0, 7);
const OUT = path.join(
  "docs/revamp/screenshots",
  `live-v1-visual-verification-${HEAD_SHORT}`,
);
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  ["home", "/"],
  ["about", "/about"],
  ["programs", "/programs"],
  ["programs-functional-training", "/programs/functional-training"],
  ["programs-home-personal-training", "/programs/home-personal-training"],
  ["programs-online-training", "/programs/online-training"],
  ["programs-zumba", "/programs/zumba"],
  ["programs-yoga", "/programs/yoga"],
  ["programs-adult-dance", "/programs/adult-dance"],
  ["programs-wedding-choreography", "/programs/wedding-choreography"],
  ["locations", "/locations"],
  ["locations-airoli-sector-19", "/locations/airoli-sector-19"],
  ["locations-airoli-sector-8", "/locations/airoli-sector-8"],
  ["locations-ghansoli", "/locations/ghansoli"],
  ["locations-thane", "/locations/thane"],
  ["timetable", "/timetable"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
  ["contact", "/contact"],
  ["privacy-policy", "/privacy-policy"],
  ["terms", "/terms"],
  ["trainers", "/trainers"],
  ["transformations", "/transformations"],
  ["blog", "/blog"],
  ["not-found", "/this-page-does-not-exist"],
];

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

async function capture(browser, name, route, w, h) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const response = await page.goto(BASE + route, {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await page.waitForTimeout(500);
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: true });
  const { width, height } = pngSize(file);
  const sticky = await page.locator("[data-sticky-cta-eligible]").count();
  const hasPad = await page.evaluate(() =>
    document.body.classList.contains("has-sticky-cta"),
  );
  const robots = (
    await page
      .locator('meta[name="robots"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("content") || ""))
  ).join(" | ");
  const canonical =
    (await page.locator('link[rel="canonical"]').count()) > 0
      ? (await page.locator('link[rel="canonical"]').first().getAttribute("href")) ||
        ""
      : "";
  const record = {
    filename: name,
    sha: HEAD,
    productionUrl: BASE,
    route,
    httpStatus: response?.status() ?? null,
    viewportWidth: w,
    pngWidth: width,
    pngHeight: height,
    deviceScaleFactor: 1,
    timestamp: new Date().toISOString(),
    sha256: sha256(file),
    sticky,
    hasPad,
    robots,
    canonical,
    widthPass: width === w,
  };
  console.log(record.widthPass ? "ok" : "FAIL", name, response?.status(), width);
  await ctx.close();
  return record;
}

(async () => {
  const browser = await chromium.launch();
  const records = [];
  for (const [slug, route] of ROUTES) {
    for (const [w, h, tag] of [
      [390, 844, "390"],
      [1440, 900, "1440"],
    ]) {
      records.push(await capture(browser, `full-${tag}-${slug}.png`, route, w, h));
    }
  }

  // Live functional smoke extras
  const page = await browser.newPage();
  const smoke = { samples404: [], redirects: [], sitemap: {}, conversion: {} };
  for (const slug of ["sample-starting-with-strength", "sample-finding-your-first-class"]) {
    const res = await page.goto(BASE + `/blog/${slug}`, { waitUntil: "domcontentloaded" });
    smoke.samples404.push({ slug, status: res?.status(), pass: res?.status() === 404 });
  }
  for (const [from, expect] of [
    ["/book-a-free-trial", "/trial"],
    ["/locations/airoli", "/locations/airoli-sector-19"],
  ]) {
    await page.goto(BASE + from, { waitUntil: "networkidle" });
    smoke.redirects.push({ from, final: page.url(), pass: page.url().includes(expect) });
  }
  const robotsRes = await page.goto(BASE + "/robots.txt");
  const robotsText = await page.locator("body").innerText();
  const smRes = await page.goto(BASE + "/sitemap.xml");
  const smText = await page.locator("body").innerText();
  smoke.sitemap = {
    robotsStatus: robotsRes?.status(),
    sitemapStatus: smRes?.status(),
    robotsHasLocalhost: /localhost/i.test(robotsText),
    sitemapHasLocalhost: /localhost/i.test(smText),
    sitemapHasTrainers: /\/trainers/.test(smText),
    sitemapHasBlog: /\/blog/.test(smText),
  };
  await page.goto(BASE + "/trial", { waitUntil: "networkidle" });
  const wa = await page.locator("a[href*='wa.me']").first().getAttribute("href");
  const tel = await page.locator('a[href^="tel:"]').first().getAttribute("href").catch(() => null);
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  const tel2 = await page.locator('a[href^="tel:"]').first().getAttribute("href");
  const mail = await page.locator('a[href^="mailto:"]').first().getAttribute("href");
  smoke.conversion = {
    whatsapp: wa,
    tel: tel2 || tel,
    mail,
    phoneOk: /919372402074/.test(String(wa || "")),
    telOk: (tel2 || tel) === "tel:+919372402074",
    mailOk: mail === "mailto:ankitsstudio5@gmail.com",
  };
  await page.close();
  await browser.close();

  const dimFails = records.filter((r) => !r.widthPass);
  const stickyExcluded = records.filter((r) =>
    ["/privacy-policy", "/terms", "/trainers", "/transformations", "/blog", "/this-page-does-not-exist"].includes(
      r.route,
    ),
  );
  const stickyFails = stickyExcluded.filter((r) => r.sticky !== 0 || r.hasPad);
  const manifest = {
    generatedAt: new Date().toISOString(),
    sha: HEAD,
    productionUrl: BASE,
    deploymentAlias: "https://ankits-studio.vercel.app",
    recordCount: records.length,
    dimensionFails: dimFails.length,
    stickyExclusionFails: stickyFails.length,
    smoke,
    records,
  };
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(
    JSON.stringify(
      {
        dimFails: dimFails.length,
        stickyFails: stickyFails.length,
        samplesOk: smoke.samples404.every((s) => s.pass),
        conversion: smoke.conversion,
        sitemap: smoke.sitemap,
      },
      null,
      2,
    ),
  );
  if (dimFails.length || stickyFails.length || !smoke.samples404.every((s) => s.pass)) {
    process.exit(1);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
