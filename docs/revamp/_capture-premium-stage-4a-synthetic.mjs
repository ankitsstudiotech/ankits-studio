/**
 * Stage 4A Part 2 — synthetic concept media integration evidence.
 *
 * Flag TRUE screenshots + videos:
 *   PLAYWRIGHT_BASE_URL=http://127.0.0.1:PORT node docs/revamp/_capture-premium-stage-4a-synthetic.mjs
 *
 * Flag FALSE regression (set MODE=flag-false):
 *   MODE=flag-false PLAYWRIGHT_BASE_URL=... node docs/revamp/_capture-premium-stage-4a-synthetic.mjs
 *
 * Requires a Next server built/started with the matching NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA value.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE =
  process.env.PLAYWRIGHT_BASE_URL || process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const MODE = process.env.MODE || "flag-true";
const SHOT_OUT = path.resolve(
  "docs/revamp/screenshots/premium-stage-4a-synthetic-integration",
);
const VIDEO_OUT = path.resolve(
  "docs/revamp/motion/premium-stage-4a-synthetic-integration",
);

const FULL_ROUTES = [
  { name: "home", path: "/" },
  { name: "functional-training", path: "/programs/functional-training" },
  { name: "zumba", path: "/programs/zumba" },
  { name: "yoga", path: "/programs/yoga" },
  { name: "dance", path: "/programs/adult-dance" },
  { name: "wedding-choreography", path: "/programs/wedding-choreography" },
  { name: "home-personal-training", path: "/programs/home-personal-training" },
  { name: "online-training", path: "/programs/online-training" },
  { name: "about", path: "/about" },
  { name: "locations", path: "/locations" },
];

const VIEWPORT_SETS = {
  full: [
    { name: "390", width: 390, height: 844, routes: FULL_ROUTES },
    {
      name: "768",
      width: 768,
      height: 1024,
      routes: FULL_ROUTES.filter((r) =>
        ["home", "functional-training", "yoga", "about", "locations"].includes(r.name),
      ),
    },
    { name: "1440", width: 1440, height: 900, routes: FULL_ROUTES },
    {
      name: "1920",
      width: 1920,
      height: 1080,
      routes: FULL_ROUTES.filter((r) =>
        ["home", "functional-training", "yoga", "dance", "about"].includes(r.name),
      ),
    },
  ],
  normal: [
    {
      name: "390x844",
      width: 390,
      height: 844,
      routes: FULL_ROUTES.filter((r) =>
        ["home", "functional-training", "yoga", "wedding-choreography"].includes(r.name),
      ),
    },
    {
      name: "1440x900",
      width: 1440,
      height: 900,
      routes: FULL_ROUTES.filter((r) =>
        [
          "home",
          "functional-training",
          "zumba",
          "yoga",
          "dance",
          "wedding-choreography",
          "about",
        ].includes(r.name),
      ),
    },
  ],
};

const FLAG_FALSE_ROUTES = [
  { name: "home", path: "/" },
  { name: "functional", path: "/programs/functional-training" },
  { name: "about", path: "/about" },
  { name: "locations", path: "/locations" },
];

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function hold(page, ms) {
  const step = 400;
  let left = ms;
  while (left > 0) {
    const slice = Math.min(step, left);
    await page.mouse.move(40 + (left % 80), 80 + (left % 40));
    await pause(slice);
    left -= slice;
  }
}

function ensureCleanDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) {
    fs.unlinkSync(path.join(dir, f));
  }
}

async function withVideo(browser, outDir, name, size, fn, options = {}) {
  const context = await browser.newContext({
    viewport: size,
    recordVideo: { dir: outDir, size },
    reducedMotion: options.reducedMotion || "no-preference",
    colorScheme: "dark",
  });
  const page = await context.newPage();
  try {
    await fn(page);
  } finally {
    const video = page.video();
    await page.close();
    await context.close();
    if (video) {
      const src = await video.path();
      const dest = path.join(outDir, `${name}.webm`);
      if (src && fs.existsSync(src)) fs.renameSync(src, dest);
    }
  }
}

async function captureFlagFalse(browser) {
  fs.mkdirSync(SHOT_OUT, { recursive: true });
  // Do not wipe flag-true evidence — only overwrite flag-false-* files.
  for (const f of fs.readdirSync(SHOT_OUT)) {
    if (f.startsWith("flag-false-") || f === "perf-flag-false.json") {
      fs.unlinkSync(path.join(SHOT_OUT, f));
    }
  }
  for (const vp of [
    { name: "390", width: 390, height: 844 },
    { name: "1440", width: 1440, height: 900 },
  ]) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: "dark",
    });
    const page = await context.newPage();
    for (const route of FLAG_FALSE_ROUTES) {
      await page.goto(BASE + route.path, { waitUntil: "networkidle" });
      await pause(350);
      const file = `flag-false-${vp.name}-${route.name}.png`;
      await page.screenshot({ path: path.join(SHOT_OUT, file), fullPage: true });
      const dims = await page.evaluate(() => ({
        w: document.documentElement.clientWidth,
        h: window.innerHeight,
      }));
      if (dims.w !== vp.width) {
        throw new Error(`Viewport mismatch ${file}: got ${dims.w}, expected ${vp.width}`);
      }
    }
    await context.close();
  }
}

async function captureFlagTrue(browser) {
  ensureCleanDir(SHOT_OUT);
  ensureCleanDir(VIDEO_OUT);

  for (const [kind, sets] of Object.entries(VIEWPORT_SETS)) {
    for (const vp of sets) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: "dark",
      });
      const page = await context.newPage();
      for (const route of vp.routes) {
        await page.goto(BASE + route.path, { waitUntil: "networkidle" });
        await pause(450);
        const prefix = kind === "normal" ? `normal-${vp.name}` : `full-${vp.name}`;
        const file = `${prefix}-${route.name}.png`;
        await page.screenshot({
          path: path.join(SHOT_OUT, file),
          fullPage: kind === "full",
        });
        const dims = await page.evaluate(() => ({
          w: document.documentElement.clientWidth,
          h: window.innerHeight,
        }));
        if (dims.w !== vp.width) {
          throw new Error(`Viewport mismatch ${file}: got ${dims.w}, expected ${vp.width}`);
        }
      }
      await context.close();
    }
  }

  const desktop = { width: 1440, height: 900 };
  const mobile = { width: 390, height: 844 };

  // A. home-media-desktop.webm
  await withVideo(browser, VIDEO_OUT, "home-media-desktop", desktop, async (page) => {
    await page.goto(BASE + "/", { waitUntil: "commit" });
    await page.waitForSelector("#home-hero-title", { state: "attached" });
    await hold(page, 2800);
    await page.locator("#programs, [data-cluster], .lanes a").first().scrollIntoViewIfNeeded().catch(() => {});
    await hold(page, 1800);
    await page.locator("#studio").scrollIntoViewIfNeeded();
    await hold(page, 2200);
    await page.locator("#locations, [href*='locations']").first().scrollIntoViewIfNeeded().catch(() => {});
    await hold(page, 2200);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await hold(page, 1600);
  });

  // B. home-media-mobile.webm
  await withVideo(browser, VIDEO_OUT, "home-media-mobile", mobile, async (page) => {
    await page.goto(BASE + "/", { waitUntil: "commit" });
    await page.waitForSelector("#home-hero-title", { state: "attached" });
    await hold(page, 2200);
    await page.locator("#studio").scrollIntoViewIfNeeded();
    await hold(page, 2000);
    await page.evaluate(() => window.scrollBy(0, 500));
    await hold(page, 1600);
  });

  // C. programme-media.webm — Functional → Zumba → Yoga → Dance → Wedding
  await withVideo(browser, VIDEO_OUT, "programme-media", desktop, async (page) => {
    for (const slug of [
      "functional-training",
      "zumba",
      "yoga",
      "adult-dance",
      "wedding-choreography",
    ]) {
      await page.goto(BASE + `/programs/${slug}`, { waitUntil: "commit" });
      await page.waitForSelector("#programme-title", { state: "attached" });
      await hold(page, 2200);
    }
  });

  // D. reduced-motion-media.webm
  await withVideo(
    browser,
    VIDEO_OUT,
    "reduced-motion-media",
    desktop,
    async (page) => {
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      await hold(page, 1600);
      await page.goto(BASE + "/programs/yoga", { waitUntil: "networkidle" });
      await hold(page, 1600);
      await page.goto(BASE + "/programs/functional-training", { waitUntil: "networkidle" });
      await hold(page, 1600);
    },
    { reducedMotion: "reduce" },
  );
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    if (MODE === "flag-false") {
      await captureFlagFalse(browser);
    } else {
      await captureFlagTrue(browser);
    }
  } finally {
    await browser.close();
  }

  const existingShots = fs.existsSync(SHOT_OUT) ? fs.readdirSync(SHOT_OUT).sort() : [];
  const existingVideos = fs.existsSync(VIDEO_OUT) ? fs.readdirSync(VIDEO_OUT).sort() : [];
  const manifest = {
    lastMode: MODE,
    base: BASE,
    generatedAt: new Date().toISOString(),
    screenshots: existingShots,
    videos: existingVideos,
  };
  fs.writeFileSync(
    path.join(SHOT_OUT, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log("Wrote", SHOT_OUT);
  console.log("Mode", MODE, "shots", manifest.screenshots.length, "videos", manifest.videos.length);
}

await main();
