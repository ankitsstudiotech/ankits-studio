/**
 * Stage 1 — production truth screenshots (local production server).
 */
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3490";
const OUT = path.join("docs/revamp/screenshots/premium-stage-1-production-truth");
fs.mkdirSync(OUT, { recursive: true });

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function shot(browser, name, route, w, h, fullPage, scrollTo) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(400);
  if (scrollTo) {
    await page.locator(scrollTo).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }
  const sticky = await page.locator("[data-sticky-cta-eligible]").count();
  const reveal = await page
    .locator("[data-sticky-cta-reveal]")
    .getAttribute("data-sticky-cta-reveal")
    .catch(() => null);
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage });
  const { width, height } = pngSize(file);
  console.log(
    width === w ? "ok" : "FAIL",
    name,
    `${width}x${height}`,
    "sticky",
    sticky,
    "reveal",
    reveal,
  );
  await ctx.close();
  return { name, width, expected: w, sticky, reveal, pass: width === w };
}

(async () => {
  const browser = await chromium.launch();
  const records = [];

  const fullRoutes = [
    ["home", "/"],
    ["pricing", "/pricing"],
    ["timetable", "/timetable"],
    ["trial", "/trial"],
    ["contact", "/contact"],
    ["about", "/about"],
    ["programs", "/programs"],
    ["programs-functional-training", "/programs/functional-training"],
    ["programs-yoga", "/programs/yoga"],
    ["programs-wedding-choreography", "/programs/wedding-choreography"],
  ];

  for (const [slug, route] of fullRoutes) {
    for (const [w, h, tag] of [
      [390, 844, "390"],
      [768, 1024, "768"],
      [1440, 900, "1440"],
    ]) {
      records.push(
        await shot(browser, `full-${tag}-${slug}.png`, route, w, h, true),
      );
    }
  }

  // Sticky state viewports
  records.push(
    await shot(
      browser,
      "viewport-390-pricing-enquiry-in-view.png",
      "/pricing",
      390,
      844,
      false,
      "#pricing-enquiry",
    ),
  );
  records.push(
    await shot(
      browser,
      "viewport-390-timetable-enquiry-in-view.png",
      "/timetable",
      390,
      844,
      false,
      "#availability-enquiry",
    ),
  );
  records.push(
    await shot(browser, "viewport-390-trial.png", "/trial", 390, 844, false),
  );
  records.push(
    await shot(browser, "viewport-390-contact.png", "/contact", 390, 844, false),
  );

  await browser.close();
  const fails = records.filter((r) => !r.pass);
  fs.writeFileSync(
    path.join(OUT, "manifest.json"),
    JSON.stringify(
      { generatedAt: new Date().toISOString(), base: BASE, fails: fails.length, records },
      null,
      2,
    ),
  );
  console.log("fails", fails.length);
  if (fails.length) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
