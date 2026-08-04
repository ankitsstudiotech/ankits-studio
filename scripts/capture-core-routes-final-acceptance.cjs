/**
 * Native-width full-page screenshots for Prompt 2 final acceptance.
 * deviceScaleFactor: 1 — PNG width must equal viewport width.
 */
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const OUT = path.join("docs/revamp/screenshots/core-routes-final-acceptance");
const BASE = process.env.BASE_URL || "http://localhost:3000";

function readPngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`Not a PNG: ${filePath}`);
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

const VIEWPORTS = {
  390: { width: 390, height: 844 },
  768: { width: 768, height: 1024 },
  1440: { width: 1440, height: 900 },
};

/** [filenameSlug, path] — required at 390 + 1440 */
const ROUTES_FULL = [
  ["about", "/about"],
  ["programs", "/programs"],
  ["program-functional-training", "/programs/functional-training"],
  ["program-home-personal-training", "/programs/home-personal-training"],
  ["program-online-training", "/programs/online-training"],
  ["program-zumba", "/programs/zumba"],
  ["program-yoga", "/programs/yoga"],
  ["program-dance", "/programs/adult-dance"],
  ["program-wedding-choreography", "/programs/wedding-choreography"],
  ["locations", "/locations"],
  ["location-airoli-sector-19", "/locations/airoli-sector-19"],
  ["location-airoli-sector-8", "/locations/airoli-sector-8"],
  ["location-ghansoli", "/locations/ghansoli"],
  ["location-thane", "/locations/thane"],
  ["batch-availability", "/timetable"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
  ["contact", "/contact"],
  ["homepage-regression", "/"],
];

/** Required at 768 */
const ROUTES_768 = [
  ["about", "/about"],
  ["programs", "/programs"],
  ["program-functional-training", "/programs/functional-training"],
  ["locations", "/locations"],
  ["location-airoli-sector-19", "/locations/airoli-sector-19"],
  ["batch-availability", "/timetable"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
  ["contact", "/contact"],
];

fs.mkdirSync(OUT, { recursive: true });

async function capture(browser, filename, url, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(600);
  const filePath = path.join(OUT, filename);
  await page.screenshot({ path: filePath, fullPage: true });
  await context.close();
  console.log("ok", filename);
  return filePath;
}

function validateDimensions(files) {
  const records = [];
  let failed = 0;
  for (const { filename, expectedWidth } of files) {
    const { width, height } = readPngSize(path.join(OUT, filename));
    const pass = width === expectedWidth;
    if (!pass) failed += 1;
    records.push({
      filename,
      expectedWidth,
      actualWidth: width,
      actualHeight: height,
      result: pass ? "pass" : "fail",
    });
    console.log(
      pass ? "PASS" : "FAIL",
      filename,
      `expected=${expectedWidth}`,
      `actual=${width}x${height}`,
    );
  }
  fs.writeFileSync(
    path.join(OUT, "dimensions.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), records }, null, 2),
  );
  return failed;
}

(async () => {
  const browser = await chromium.launch();
  const tracked = [];

  for (const [slug, url] of ROUTES_FULL) {
    for (const tag of [390, 1440]) {
      const filename = `${tag}-${slug}.png`;
      await capture(browser, filename, url, VIEWPORTS[tag]);
      tracked.push({ filename, expectedWidth: tag });
    }
  }

  for (const [slug, url] of ROUTES_768) {
    const filename = `768-${slug}.png`;
    await capture(browser, filename, url, VIEWPORTS[768]);
    tracked.push({ filename, expectedWidth: 768 });
  }

  await browser.close();

  const failed = validateDimensions(tracked);
  if (failed > 0) {
    console.error(`Dimension validation failed: ${failed} file(s)`);
    process.exit(1);
  }
  console.log("All screenshot widths validated.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
