/**
 * Stage 5 art-direction evidence — screenshots + videos + comparison sheet.
 * PLAYWRIGHT_BASE_URL=… MODE=flag-true|flag-false node docs/revamp/_capture-premium-stage-5.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3505";
const MODE = process.env.MODE || "flag-true";
const SHOT = path.resolve("docs/revamp/screenshots/premium-stage-5-art-direction");
const VID = path.resolve("docs/revamp/motion/premium-stage-5-art-direction");

const FULL_390 = [
  ["home", "/"],
  ["about", "/about"],
  ["programs", "/programs"],
  ["functional-training", "/programs/functional-training"],
  ["zumba", "/programs/zumba"],
  ["yoga", "/programs/yoga"],
  ["dance", "/programs/adult-dance"],
  ["wedding-choreography", "/programs/wedding-choreography"],
  ["home-personal-training", "/programs/home-personal-training"],
  ["online-training", "/programs/online-training"],
  ["locations", "/locations"],
  ["airoli-sector-19", "/locations/airoli-sector-19"],
  ["airoli-sector-8", "/locations/airoli-sector-8"],
  ["ghansoli", "/locations/ghansoli"],
  ["thane", "/locations/thane"],
  ["pricing", "/pricing"],
  ["timetable", "/timetable"],
  ["trial", "/trial"],
  ["contact", "/contact"],
];

const FULL_768 = [
  ["home", "/"],
  ["about", "/about"],
  ["programs", "/programs"],
  ["functional-training", "/programs/functional-training"],
  ["zumba", "/programs/zumba"],
  ["yoga", "/programs/yoga"],
  ["dance", "/programs/adult-dance"],
  ["wedding-choreography", "/programs/wedding-choreography"],
  ["locations", "/locations"],
  ["airoli-sector-19", "/locations/airoli-sector-19"],
  ["pricing", "/pricing"],
  ["timetable", "/timetable"],
  ["trial", "/trial"],
  ["contact", "/contact"],
];

const FULL_1920 = [
  ["home", "/"],
  ["about", "/about"],
  ["programs", "/programs"],
  ["functional-training", "/programs/functional-training"],
  ["yoga", "/programs/yoga"],
  ["dance", "/programs/adult-dance"],
  ["wedding-choreography", "/programs/wedding-choreography"],
  ["locations", "/locations"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
];

const NORMAL_SET = [
  ["home", "/"],
  ["about", "/about"],
  ["programs", "/programs"],
  ["functional-training", "/programs/functional-training"],
  ["zumba", "/programs/zumba"],
  ["yoga", "/programs/yoga"],
  ["dance", "/programs/adult-dance"],
  ["wedding-choreography", "/programs/wedding-choreography"],
  ["home-personal-training", "/programs/home-personal-training"],
  ["online-training", "/programs/online-training"],
  ["locations", "/locations"],
  ["pricing", "/pricing"],
  ["trial", "/trial"],
];

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function hold(page, ms) {
  let left = ms;
  while (left > 0) {
    const slice = Math.min(400, left);
    await page.mouse.move(50 + (left % 60), 90 + (left % 30));
    await pause(slice);
    left -= slice;
  }
}

function ensureClean(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
}

async function shotSet(browser, label, width, height, routes, fullPage) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  const dims = [];
  for (const [name, route] of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await pause(400);
    const file = `${label}-${name}.png`;
    await page.screenshot({ path: path.join(SHOT, file), fullPage });
    const d = await page.evaluate(() => ({
      w: document.documentElement.clientWidth,
      h: window.innerHeight,
    }));
    if (d.w !== width) throw new Error(`Viewport mismatch ${file}: ${d.w}≠${width}`);
    dims.push({ file, viewport: { width, height }, clientWidth: d.w });
  }
  await ctx.close();
  return dims;
}

async function withVideo(browser, name, size, fn, options = {}) {
  const ctx = await browser.newContext({
    viewport: size,
    recordVideo: { dir: VID, size },
    reducedMotion: options.reducedMotion || "no-preference",
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  try {
    await fn(page);
  } finally {
    const video = page.video();
    await page.close();
    await ctx.close();
    if (video) {
      const src = await video.path();
      if (src && fs.existsSync(src)) fs.renameSync(src, path.join(VID, `${name}.webm`));
    }
  }
}

async function comparisonSheet(browser) {
  const programmes = [
    ["Functional", "/programs/functional-training"],
    ["Zumba", "/programs/zumba"],
    ["Yoga", "/programs/yoga"],
    ["Dance", "/programs/adult-dance"],
    ["Wedding", "/programs/wedding-choreography"],
    ["Home PT", "/programs/home-personal-training"],
    ["Online", "/programs/online-training"],
  ];
  const crops = [];
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  for (const [label, route] of programmes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await pause(500);
    const buf = await page.screenshot({ fullPage: false, type: "png" });
    crops.push({ label, buf });
  }
  await ctx.close();

  // Compose labelled sheet via Playwright page HTML canvas
  const sheet = await browser.newPage({ viewport: { width: 1600, height: 2200 } });
  const dataUrls = crops.map((c) => ({
    label: c.label,
    url: `data:image/png;base64,${c.buf.toString("base64")}`,
  }));
  await sheet.setContent(`<!doctype html><html><body style="margin:0;background:#0b0b0c;color:#fff;font-family:system-ui">
  <h1 style="padding:24px 24px 8px;font-size:28px;letter-spacing:.04em;text-transform:uppercase">Programme family comparison · 1440×900</h1>
  <p style="padding:0 24px 16px;opacity:.7;margin:0">Four composition families · seven services · one Studio Pulse language</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px 24px 32px">
    ${dataUrls
      .map(
        (d) => `<figure style="margin:0"><figcaption style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;opacity:.85">${d.label}</figcaption><img src="${d.url}" style="width:100%;height:auto;display:block;border:1px solid #333"/></figure>`,
      )
      .join("")}
  </div></body></html>`);
  await pause(800);
  await sheet.screenshot({
    path: path.join(SHOT, "programme-family-comparison.png"),
    fullPage: true,
  });
  await sheet.close();
}

async function captureFlagFalse(browser) {
  for (const f of fs.readdirSync(SHOT)) {
    if (f.startsWith("flag-false-")) fs.unlinkSync(path.join(SHOT, f));
  }
  await shotSet(
    browser,
    "flag-false-390",
    390,
    844,
    [
      ["home", "/"],
      ["about", "/about"],
      ["functional", "/programs/functional-training"],
      ["locations", "/locations"],
    ],
    true,
  );
  await shotSet(
    browser,
    "flag-false-1440",
    1440,
    900,
    [
      ["home", "/"],
      ["about", "/about"],
      ["functional", "/programs/functional-training"],
      ["locations", "/locations"],
    ],
    true,
  );
}

async function captureFlagTrue(browser) {
  ensureClean(SHOT);
  ensureClean(VID);
  const manifestDims = [];
  manifestDims.push(...(await shotSet(browser, "full-390", 390, 844, FULL_390, true)));
  manifestDims.push(...(await shotSet(browser, "full-768", 768, 1024, FULL_768, true)));
  manifestDims.push(...(await shotSet(browser, "full-1440", 1440, 900, FULL_390, true)));
  manifestDims.push(...(await shotSet(browser, "full-1920", 1920, 1080, FULL_1920, true)));
  manifestDims.push(...(await shotSet(browser, "normal-390x844", 390, 844, NORMAL_SET, false)));
  manifestDims.push(...(await shotSet(browser, "normal-1440x900", 1440, 900, NORMAL_SET, false)));
  await comparisonSheet(browser);

  const desktop = { width: 1440, height: 900 };
  const mobile = { width: 390, height: 844 };

  await withVideo(browser, "homepage", desktop, async (page) => {
    await page.goto(BASE + "/", { waitUntil: "commit" });
    await page.waitForSelector("#home-hero-title");
    await hold(page, 2800);
    await page.locator("#services").scrollIntoViewIfNeeded();
    await hold(page, 2200);
    await page.locator("#studio").scrollIntoViewIfNeeded();
    await hold(page, 2200);
    await page.locator("#locations").scrollIntoViewIfNeeded();
    await hold(page, 2000);
  });

  await withVideo(browser, "programme-family", desktop, async (page) => {
    for (const slug of [
      "functional-training",
      "zumba",
      "yoga",
      "adult-dance",
      "wedding-choreography",
      "home-personal-training",
      "online-training",
    ]) {
      await page.goto(BASE + `/programs/${slug}`, { waitUntil: "commit" });
      await page.waitForSelector("#programme-title");
      await hold(page, 2400);
    }
  });

  await withVideo(browser, "mobile", mobile, async (page) => {
    await page.goto(BASE + "/", { waitUntil: "commit" });
    await page.waitForSelector("#home-hero-title");
    await hold(page, 2000);
    await page.goto(BASE + "/programs/yoga", { waitUntil: "commit" });
    await hold(page, 1800);
    await page.goto(BASE + "/programs/functional-training", { waitUntil: "commit" });
    await hold(page, 1800);
  });

  await withVideo(browser, "about-locations", desktop, async (page) => {
    await page.goto(BASE + "/about", { waitUntil: "networkidle" });
    await hold(page, 2200);
    await page.evaluate(() => window.scrollBy(0, 600));
    await hold(page, 1600);
    await page.goto(BASE + "/locations", { waitUntil: "networkidle" });
    await hold(page, 2200);
    await page.goto(BASE + "/locations/airoli-sector-19", { waitUntil: "networkidle" });
    await hold(page, 1800);
  });

  await withVideo(browser, "utility", desktop, async (page) => {
    for (const route of ["/pricing", "/timetable", "/trial", "/contact"]) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await hold(page, 2000);
    }
  });

  return manifestDims;
}

const browser = await chromium.launch({ headless: true });
let dims = [];
try {
  if (MODE === "flag-false") await captureFlagFalse(browser);
  else dims = await captureFlagTrue(browser);
} finally {
  await browser.close();
}

const shots = fs.readdirSync(SHOT).sort();
const videos = fs.existsSync(VID) ? fs.readdirSync(VID).sort() : [];
fs.writeFileSync(
  path.join(SHOT, "manifest.json"),
  JSON.stringify(
    {
      mode: MODE,
      base: BASE,
      generatedAt: new Date().toISOString(),
      screenshots: shots,
      videos,
      dimensions: dims,
    },
    null,
    2,
  ),
);
console.log("shots", shots.length, "videos", videos.length);
