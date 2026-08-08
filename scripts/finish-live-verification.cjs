const { chromium } = require("@playwright/test");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const BASE = "https://ankits-studio.vercel.app";
const HEAD = process.env.HEAD_SHA || require("child_process").execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
const OUT = path.join("docs/revamp/screenshots", `live-v1-visual-verification-${HEAD.slice(0, 7)}`);
fs.mkdirSync(OUT, { recursive: true });

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}
function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

(async () => {
  const browser = await chromium.launch();
  const records = [];
  for (const [w, h, tag] of [
    [390, 844, "390"],
    [1440, 900, "1440"],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const route = "/this-page-does-not-exist";
    const res = await page.goto(BASE + route, {
      waitUntil: "networkidle",
      timeout: 120000,
    });
    await page.waitForTimeout(400);
    const name = `full-${tag}-not-found.png`;
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
    const conflictingIndex = /(?:^|\|)\s*index,\s*follow/i.test(robots);
    records.push({
      filename: name,
      sha: HEAD,
      productionUrl: BASE,
      route,
      httpStatus: res?.status() ?? null,
      viewportWidth: w,
      pngWidth: width,
      pngHeight: height,
      deviceScaleFactor: 1,
      timestamp: new Date().toISOString(),
      sha256: sha256(file),
      sticky,
      hasPad,
      robots,
      conflictingIndex,
      widthPass: width === w,
    });
    console.log("ok", name, res?.status(), width, "robots", robots);
    await ctx.close();
  }

  const page = await browser.newPage();
  const smoke = { samples404: [], redirects: [], sitemap: {}, conversion: {} };
  for (const slug of [
    "sample-starting-with-strength",
    "sample-finding-your-first-class",
  ]) {
    const res = await page.goto(BASE + `/blog/${slug}`, {
      waitUntil: "domcontentloaded",
    });
    smoke.samples404.push({
      slug,
      status: res?.status(),
      pass: res?.status() === 404,
    });
  }
  for (const [from, expect] of [
    ["/book-a-free-trial", "/trial"],
    ["/locations/airoli", "/locations/airoli-sector-19"],
  ]) {
    await page.goto(BASE + from, { waitUntil: "networkidle" });
    smoke.redirects.push({
      from,
      final: page.url(),
      pass: page.url().includes(expect),
    });
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
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  const tel = await page.locator('a[href^="tel:"]').first().getAttribute("href");
  const mail = await page
    .locator('a[href^="mailto:"]')
    .first()
    .getAttribute("href");
  smoke.conversion = {
    whatsapp: wa,
    tel,
    mail,
    phoneOk: /919372402074/.test(String(wa || "")),
    telOk: tel === "tel:+919372402074",
    mailOk: mail === "mailto:ankitsstudio5@gmail.com",
  };
  await browser.close();

  const existing = fs.readdirSync(OUT).filter((f) => f.endsWith(".png"));
  const manifest = {
    generatedAt: new Date().toISOString(),
    sha: HEAD,
    productionUrl: BASE,
    recordCount: existing.length,
    notFoundRecords: records,
    smoke,
    dimensionFails: records.filter((r) => !r.widthPass).length,
    stickyExclusionFails: records.filter((r) => r.sticky !== 0 || r.hasPad)
      .length,
    conflictingIndexFails: records.filter((r) => r.conflictingIndex).length,
  };
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(
    JSON.stringify(
      {
        pngCount: existing.length,
        smoke,
        notFound: records.map((r) => ({
          f: r.filename,
          robots: r.robots,
          sticky: r.sticky,
          conflictingIndex: r.conflictingIndex,
        })),
      },
      null,
      2,
    ),
  );
  if (
    !smoke.samples404.every((s) => s.pass) ||
    !smoke.conversion.phoneOk ||
    !smoke.conversion.telOk ||
    !smoke.conversion.mailOk ||
    records.some((r) => !r.widthPass || r.sticky !== 0 || r.conflictingIndex) ||
    smoke.sitemap.sitemapHasTrainers ||
    smoke.sitemap.sitemapHasBlog ||
    smoke.sitemap.robotsHasLocalhost
  ) {
    process.exit(1);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
