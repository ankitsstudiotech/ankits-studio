/**
 * Prompt 3 secondary-route acceptance captures + dimension validation.
 * deviceScaleFactor: 1 · port 3478 · no ALLOW_MOCK_PUBLISH
 */
const { chromium } = require("@playwright/test");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3478";
const OUT = path.join("docs/revamp/screenshots/secondary-routes-final-acceptance");
const TRACE = path.join("docs/revamp/traces/secondary-routes-final-acceptance");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TRACE, { recursive: true });

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}
function sha(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const FULL = [
  ["trainers", "/trainers"],
  ["transformations", "/transformations"],
  ["privacy-policy", "/privacy-policy"],
  ["terms", "/terms"],
  ["blog", "/blog"],
  ["legacy-strength-training", "/programs/strength-training"],
  ["legacy-personal-training", "/programs/personal-training"],
  ["legacy-kids-dance", "/programs/kids-dance"],
  ["legacy-weight-loss-fitness", "/programs/weight-loss-fitness"],
  ["not-found", "/this-page-does-not-exist-prompt3"],
];

const TABLET = [
  ["trainers", "/trainers"],
  ["transformations", "/transformations"],
  ["privacy-policy", "/privacy-policy"],
  ["terms", "/terms"],
  ["not-found", "/this-page-does-not-exist-prompt3"],
];

const REGRESSION = [
  ["home", "/"],
  ["programs", "/programs"],
  ["locations", "/locations"],
  ["trial", "/trial"],
];

async function shot(browser, name, url, w, h, fullPage) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const resp = await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(450);
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage });
  await ctx.close();
  console.log("ok", name, resp ? resp.status() : "");
  return file;
}

(async () => {
  const browser = await chromium.launch();
  const records = [];

  for (const [slug, route] of FULL) {
    for (const [w, h, tag] of [
      [390, 844, "390"],
      [1440, 900, "1440"],
    ]) {
      const filename = `${tag}-${slug}.png`;
      const file = await shot(browser, filename, route, w, h, true);
      const { width, height } = pngSize(file);
      records.push({
        filename,
        route,
        expectedWidth: w,
        actualWidth: width,
        actualHeight: height,
        fullPage: true,
        result: width === w ? "pass" : "fail",
        sha256: sha(file),
      });
    }
  }

  for (const [slug, route] of TABLET) {
    const filename = `768-${slug}.png`;
    const file = await shot(browser, filename, route, 768, 1024, true);
    const { width, height } = pngSize(file);
    records.push({
      filename,
      route,
      expectedWidth: 768,
      actualWidth: width,
      actualHeight: height,
      fullPage: true,
      result: width === 768 ? "pass" : "fail",
      sha256: sha(file),
    });
  }

  for (const [slug, route] of REGRESSION) {
    for (const [w, h, tag] of [
      [390, 844, "390"],
      [1440, 900, "1440"],
    ]) {
      const filename = `regression-${tag}-${slug}.png`;
      const file = await shot(browser, filename, route, w, h, false);
      const { width, height } = pngSize(file);
      records.push({
        filename,
        route,
        expectedWidth: w,
        actualWidth: width,
        actualHeight: height,
        fullPage: false,
        result: width === w ? "pass" : "fail",
        sha256: sha(file),
      });
    }
  }

  // Sample blog must 404
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const resp = await page.goto(BASE + "/blog/sample-starting-with-strength", {
      waitUntil: "networkidle",
    });
    const status = resp ? resp.status() : 0;
    await page.screenshot({
      path: path.join(OUT, "1440-blog-sample-404.png"),
      fullPage: true,
    });
    console.log("sample blog status", status);
    fs.writeFileSync(
      path.join(OUT, "sample-blog-status.json"),
      JSON.stringify({ status, pass: status === 404 }, null, 2),
    );
    await ctx.close();
  }

  // Interaction / reduced-motion states
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    await ctx.tracing.start({ screenshots: true, snapshots: true });
    const page = await ctx.newPage();
    await page.goto(BASE + "/trainers", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const cta = page.locator("a").filter({ hasText: /WhatsApp|availability|trial/i }).first();
    if (await cta.count()) {
      await cta.hover();
      await page.screenshot({ path: path.join(OUT, "state-1440-trainers-cta-hover.png") });
      await cta.focus();
      await page.screenshot({ path: path.join(OUT, "state-1440-trainers-cta-focus.png") });
    }
    await page.goto(BASE + "/transformations", { waitUntil: "networkidle" });
    const tcta = page.locator("a").filter({ hasText: /trial|WhatsApp/i }).first();
    if (await tcta.count()) {
      await tcta.hover();
      await page.screenshot({ path: path.join(OUT, "state-1440-transformations-cta-hover.png") });
      await tcta.focus();
      await page.screenshot({ path: path.join(OUT, "state-1440-transformations-cta-focus.png") });
    }
    await page.goto(BASE + "/privacy-policy", { waitUntil: "networkidle" });
    const link = page.locator("article a").first();
    if (await link.count()) {
      await link.focus();
      await page.screenshot({ path: path.join(OUT, "state-1440-privacy-link-focus.png") });
    }
    await page.goto(BASE + "/terms", { waitUntil: "networkidle" });
    const tlink = page.locator("article a").first();
    if (await tlink.count()) {
      await tlink.focus();
      await page.screenshot({ path: path.join(OUT, "state-1440-terms-link-focus.png") });
    }
    await page.goto(BASE + "/this-page-does-not-exist-prompt3", { waitUntil: "networkidle" });
    const home = page.locator('a[href="/"]').filter({ hasText: /Home/i }).first();
    await home.hover();
    await page.screenshot({ path: path.join(OUT, "state-1440-404-home-hover.png") });
    await home.focus();
    await page.screenshot({ path: path.join(OUT, "state-1440-404-home-focus.png") });
    await ctx.tracing.stop({ path: path.join(TRACE, "secondary-interactions.zip") });
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    await ctx.tracing.start({ screenshots: true, snapshots: true });
    const page = await ctx.newPage();
    await page.goto(BASE + "/trainers", { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(OUT, "state-1440-trainers-reduced-motion.png"),
    });
    await page.goto(BASE + "/this-page-does-not-exist-prompt3", { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUT, "state-1440-404-reduced-motion.png") });
    await ctx.tracing.stop({ path: path.join(TRACE, "secondary-reduced-motion.zip") });
    await ctx.close();
  }

  await browser.close();

  const failed = records.filter((r) => r.result !== "pass").length;
  fs.writeFileSync(
    path.join(OUT, "dimensions.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        failed,
        records,
      },
      null,
      2,
    ),
  );
  console.log("dimension fails", failed, "of", records.length);
  if (failed) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
