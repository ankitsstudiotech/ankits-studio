/**
 * Prompt 3 correction evidence — sticky-excluded secondary routes.
 * deviceScaleFactor: 1 · dedicated production port · no ALLOW_MOCK_PUBLISH
 */
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3480";
const OUT = path.join("docs/revamp/screenshots/secondary-routes-correction");
fs.mkdirSync(OUT, { recursive: true });

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function shot(browser, name, url, w, h, fullPage) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(500);
  const sticky = await page.locator("[data-sticky-cta-eligible]").count();
  const hasPad = await page.evaluate(() =>
    document.body.classList.contains("has-sticky-cta"),
  );
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage });
  console.log("ok", name, "sticky=", sticky, "pad=", hasPad);
  await ctx.close();
  return { file, sticky, hasPad };
}

(async () => {
  const browser = await chromium.launch();
  const records = [];
  const stickyChecks = [];

  const full = [
    ["trainers", "/trainers"],
    ["transformations", "/transformations"],
    ["privacy-policy", "/privacy-policy"],
    ["terms", "/terms"],
    ["blog", "/blog"],
    ["not-found", "/this-page-does-not-exist-prompt3-correction"],
    ["legacy-personal-training", "/programs/personal-training"],
  ];

  for (const [slug, route] of full) {
    for (const [w, h, tag] of [
      [390, 844, "390"],
      [1440, 900, "1440"],
    ]) {
      const filename = `${tag}-${slug}.png`;
      const { file, sticky, hasPad } = await shot(browser, filename, route, w, h, true);
      const { width, height } = pngSize(file);
      records.push({
        filename,
        route,
        expectedWidth: w,
        actualWidth: width,
        actualHeight: height,
        fullPage: true,
        result: width === w ? "pass" : "fail",
        stickyAbsent: sticky === 0 && !hasPad,
      });
      stickyChecks.push({ filename, sticky, hasPad, pass: sticky === 0 && !hasPad });
    }
  }

  for (const [slug, route] of [
    ["trainers", "/trainers"],
    ["transformations", "/transformations"],
    ["privacy-policy", "/privacy-policy"],
    ["terms", "/terms"],
    ["not-found", "/this-page-does-not-exist-prompt3-correction"],
  ]) {
    const filename = `viewport-390-${slug}.png`;
    const { file, sticky, hasPad } = await shot(browser, filename, route, 390, 844, false);
    const { width, height } = pngSize(file);
    records.push({
      filename,
      route,
      expectedWidth: 390,
      actualWidth: width,
      actualHeight: height,
      fullPage: false,
      result: width === 390 ? "pass" : "fail",
      stickyAbsent: sticky === 0 && !hasPad,
    });
    stickyChecks.push({ filename, sticky, hasPad, pass: sticky === 0 && !hasPad });
  }

  // Core sticky regression (viewport only)
  for (const [slug, route] of [
    ["home", "/"],
    ["programs", "/programs"],
    ["locations", "/locations"],
    ["pricing", "/pricing"],
    ["trial", "/trial"],
  ]) {
    const filename = `regression-viewport-390-${slug}.png`;
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(400);
    const sticky = await page.locator("[data-sticky-cta-eligible]").count();
    await page.screenshot({ path: path.join(OUT, filename), fullPage: false });
    console.log("regression", filename, "sticky=", sticky);
    records.push({
      filename,
      route,
      expectedWidth: 390,
      actualWidth: pngSize(path.join(OUT, filename)).width,
      actualHeight: pngSize(path.join(OUT, filename)).height,
      fullPage: false,
      result: pngSize(path.join(OUT, filename)).width === 390 ? "pass" : "fail",
      stickyPresent: sticky === 1,
    });
    await ctx.close();
  }

  await browser.close();

  const dimFails = records.filter((r) => r.result !== "pass").length;
  const stickyFails = stickyChecks.filter((s) => !s.pass).length;
  fs.writeFileSync(
    path.join(OUT, "dimensions.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        dimensionFails: dimFails,
        stickyExclusionFails: stickyFails,
        stickyChecks,
        records,
      },
      null,
      2,
    ),
  );
  console.log("dimFails", dimFails, "stickyFails", stickyFails);
  if (dimFails || stickyFails) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
