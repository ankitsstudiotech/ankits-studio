/**
 * Stage 2 — mobile editorial reduction screenshots + height measurements.
 * deviceScaleFactor: 1 · no resizing of PNGs after capture.
 */
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3492";
const OUT = path.join("docs/revamp/screenshots/premium-stage-2-mobile-editorial");
const BEFORE = path.join(
  "docs/revamp/screenshots/premium-stage-2-baseline/heights-before.json",
);
fs.mkdirSync(OUT, { recursive: true });

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function measure(page) {
  return page.evaluate(() =>
    Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.offsetHeight,
    ),
  );
}

async function shot(browser, name, route, w, h, fullPage = true) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(450);
  const scrollHeight = await measure(page);
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage });
  const { width, height } = pngSize(file);
  const pass = width === w;
  console.log(pass ? "ok" : "FAIL", name, `${width}x${height}`, `scroll=${scrollHeight}`);
  await ctx.close();
  return { name, route, width, height, expected: w, scrollHeight, pass };
}

(async () => {
  const browser = await chromium.launch();
  const records = [];
  const heights390 = {};

  const mobile390 = [
    ["home", "/"],
    ["about", "/about"],
    ["pricing", "/pricing"],
    ["timetable", "/timetable"],
    ["programs", "/programs"],
    ["functional-training", "/programs/functional-training"],
    ["home-personal-training", "/programs/home-personal-training"],
    ["online-training", "/programs/online-training"],
    ["zumba", "/programs/zumba"],
    ["yoga", "/programs/yoga"],
    ["dance", "/programs/adult-dance"],
    ["wedding-choreography", "/programs/wedding-choreography"],
    ["locations", "/locations"],
    ["branch-airoli-sector-19", "/locations/airoli-sector-19"],
    ["trial", "/trial"],
    ["contact", "/contact"],
  ];

  for (const [slug, route] of mobile390) {
    const rec = await shot(browser, `full-390-${slug}.png`, route, 390, 844, true);
    records.push(rec);
    heights390[slug] = { route, after: rec.scrollHeight, pngHeight: rec.height };
  }

  const desktop1440 = [
    ["home", "/"],
    ["about", "/about"],
    ["pricing", "/pricing"],
    ["timetable", "/timetable"],
    ["programs", "/programs"],
    ["functional-training", "/programs/functional-training"],
    ["yoga", "/programs/yoga"],
    ["wedding-choreography", "/programs/wedding-choreography"],
    ["trial", "/trial"],
    ["contact", "/contact"],
  ];
  for (const [slug, route] of desktop1440) {
    records.push(await shot(browser, `full-1440-${slug}.png`, route, 1440, 900, true));
  }

  const tablet768 = [
    ["home", "/"],
    ["about", "/about"],
    ["pricing", "/pricing"],
    ["timetable", "/timetable"],
    ["functional-training", "/programs/functional-training"],
  ];
  for (const [slug, route] of tablet768) {
    records.push(await shot(browser, `full-768-${slug}.png`, route, 768, 1024, true));
  }

  await browser.close();

  let beforeMap = {};
  if (fs.existsSync(BEFORE)) {
    const before = JSON.parse(fs.readFileSync(BEFORE, "utf8"));
    for (const row of before) {
      beforeMap[row.route] = row.h;
    }
  }

  const comparison = Object.entries(heights390).map(([slug, v]) => {
    const before = beforeMap[v.route] ?? null;
    const after = v.after;
    const reductionPct =
      before != null && before > 0
        ? Math.round(((before - after) / before) * 1000) / 10
        : null;
    return { slug, route: v.route, before, after, reductionPct, pngHeight: v.pngHeight };
  });

  const fails = records.filter((r) => !r.pass);
  fs.writeFileSync(
    path.join(OUT, "manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        base: BASE,
        deviceScaleFactor: 1,
        fails: fails.length,
        heights390: comparison,
        records,
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(
    path.join(OUT, "heights-after.json"),
    JSON.stringify(comparison, null, 2),
  );
  console.log("fails", fails.length);
  console.table(
    comparison.map((r) => ({
      route: r.route,
      before: r.before,
      after: r.after,
      pct: r.reductionPct,
    })),
  );
  if (fails.length) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
