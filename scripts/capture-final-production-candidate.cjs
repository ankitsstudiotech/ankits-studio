/**
 * Prompt 4 — final production candidate visual capture.
 * deviceScaleFactor: 1 · zoom 100% · no ALLOW_MOCK_PUBLISH
 */
const { chromium } = require("@playwright/test");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3485";
const HEAD =
  process.env.HEAD_SHA ||
  require("child_process").execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
const HEAD_SHORT = HEAD.slice(0, 7);
const OUT = path.join(
  "docs/revamp/screenshots",
  `final-production-candidate-${HEAD_SHORT}`,
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
  ["legacy-strength-training", "/programs/strength-training"],
  ["legacy-personal-training", "/programs/personal-training"],
  ["legacy-kids-dance", "/programs/kids-dance"],
  ["legacy-weight-loss-fitness", "/programs/weight-loss-fitness"],
  ["not-found", "/this-page-does-not-exist"],
];

const TABLET = new Set([
  "home",
  "about",
  "programs",
  "programs-functional-training",
  "locations",
  "locations-airoli-sector-19",
  "timetable",
  "pricing",
  "trial",
  "contact",
  "privacy-policy",
  "trainers",
  "not-found",
]);

const VIEWPORT = [
  ["home", "/"],
  ["about", "/about"],
  ["programs", "/programs"],
  ["programs-functional-training", "/programs/functional-training"],
  ["locations", "/locations"],
  ["timetable", "/timetable"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
  ["contact", "/contact"],
  ["privacy-policy", "/privacy-policy"],
  ["trainers", "/trainers"],
  ["transformations", "/transformations"],
  ["not-found", "/this-page-does-not-exist"],
];

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function slugifyRoute(route) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
}

async function capture(browser, opts) {
  const { name, route, width, height, fullPage } = opts;
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const response = await page.goto(BASE + route, {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await page.waitForTimeout(450);
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage });
  const { width: pngW, height: pngH } = pngSize(file);
  const sticky = await page.locator("[data-sticky-cta-eligible]").count();
  const hasPad = await page.evaluate(() =>
    document.body.classList.contains("has-sticky-cta"),
  );
  const record = {
    filename: name,
    headSha: HEAD,
    route,
    viewportWidth: width,
    viewportHeight: height,
    fullPage,
    pngWidth: pngW,
    pngHeight: pngH,
    deviceScaleFactor: 1,
    timestamp: new Date().toISOString(),
    sha256: sha256(file),
    httpStatus: response?.status() ?? null,
    stickyCount: sticky,
    hasStickyPad: hasPad,
    widthPass: pngW === width,
  };
  console.log(
    record.widthPass ? "ok" : "FAIL",
    name,
    `${pngW}x${pngH}`,
    "status",
    record.httpStatus,
  );
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
      records.push(
        await capture(browser, {
          name: `full-${tag}-${slug}.png`,
          route,
          width: w,
          height: h,
          fullPage: true,
        }),
      );
    }
    if (TABLET.has(slug)) {
      records.push(
        await capture(browser, {
          name: `full-768-${slug}.png`,
          route,
          width: 768,
          height: 1024,
          fullPage: true,
        }),
      );
    }
  }

  for (const [slug, route] of VIEWPORT) {
    records.push(
      await capture(browser, {
        name: `viewport-390-${slug}.png`,
        route,
        width: 390,
        height: 844,
        fullPage: false,
      }),
    );
    records.push(
      await capture(browser, {
        name: `viewport-1440-${slug}.png`,
        route,
        width: 1440,
        height: 900,
        fullPage: false,
      }),
    );
  }

  // Redirect destination spot-checks
  for (const [slug, route] of [
    ["redirect-book-a-free-trial", "/book-a-free-trial"],
    ["redirect-airoli", "/locations/airoli"],
  ]) {
    records.push(
      await capture(browser, {
        name: `full-390-${slug}.png`,
        route,
        width: 390,
        height: 844,
        fullPage: true,
      }),
    );
  }

  await browser.close();

  const dimFails = records.filter((r) => !r.widthPass);
  const manifest = {
    generatedAt: new Date().toISOString(),
    headSha: HEAD,
    headShort: HEAD_SHORT,
    baseUrl: BASE,
    allowMockPublish: false,
    deviceScaleFactor: 1,
    recordCount: records.length,
    dimensionFails: dimFails.length,
    records,
  };
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("records", records.length, "dimensionFails", dimFails.length);
  if (dimFails.length) {
    console.error(dimFails.map((d) => d.filename));
    process.exit(1);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
