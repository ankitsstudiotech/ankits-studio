const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3478";
const OUT = path.join(
  "docs/revamp/screenshots/secondary-routes-final-acceptance",
  process.argv[2] || "before",
);
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  ["trainers", "/trainers"],
  ["transformations", "/transformations"],
  ["privacy-policy", "/privacy-policy"],
  ["terms", "/terms"],
  ["blog", "/blog"],
  ["blog-sample", "/blog/sample-starting-with-strength"],
  ["legacy-strength-training", "/programs/strength-training"],
  ["legacy-personal-training", "/programs/personal-training"],
  ["legacy-kids-dance", "/programs/kids-dance"],
  ["legacy-weight-loss-fitness", "/programs/weight-loss-fitness"],
  ["not-found", "/this-page-does-not-exist-prompt3"],
];

(async () => {
  const browser = await chromium.launch();
  for (const [slug, route] of ROUTES) {
    for (const [w, h, tag] of [
      [390, 844, "390"],
      [1440, 900, "1440"],
    ]) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: h },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 90000 });
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(OUT, `${tag}-${slug}.png`),
        fullPage: true,
      });
      console.log("ok", `${tag}-${slug}.png`);
      await ctx.close();
    }
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
