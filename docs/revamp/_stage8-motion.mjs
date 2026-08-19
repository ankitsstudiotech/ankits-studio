/**
 * Stage 8 motion capture package.
 * PLAYWRIGHT_BASE_URL=… MODE=production|synthetic node docs/revamp/_stage8-motion.mjs
 *
 * Records short WebMs via Playwright video.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3810";
const OUT = path.resolve("docs/revamp/motion/stage-8-final");
fs.mkdirSync(OUT, { recursive: true });

async function record(name, viewport, reduced, script) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport,
    colorScheme: "dark",
    reducedMotion: reduced ? "reduce" : "no-preference",
    recordVideo: { dir: OUT, size: viewport },
  });
  const page = await ctx.newPage();
  await script(page);
  await page.waitForTimeout(800);
  await ctx.close();
  await browser.close();
  // Rename latest webm in OUT matching size roughly
  const files = fs
    .readdirSync(OUT)
    .filter((f) => f.endsWith(".webm"))
    .map((f) => ({ f, t: fs.statSync(path.join(OUT, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  if (files[0]) {
    const dest = path.join(OUT, name);
    fs.renameSync(path.join(OUT, files[0].f), dest);
    const size = fs.statSync(dest).size;
    if (size < 1000) throw new Error(`Zero/tiny artefact: ${name} (${size}b)`);
    console.log("ok", name, size);
  }
}

// A production home mobile
await record("production-home-mobile.webm", { width: 390, height: 844 }, false, async (page) => {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
});

// B production home desktop
await record("production-home-desktop.webm", { width: 1440, height: 900 }, false, async (page) => {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(1500);
  await page.hover('a[href="/programs/functional-training"]');
  await page.waitForTimeout(1000);
});

// E conversion mobile
await record("conversion-mobile.webm", { width: 390, height: 844 }, false, async (page) => {
  await page.goto(BASE + "/pricing", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(800);
  await page.goto(BASE + "/trial", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
});

// F reduced motion
await record("reduced-motion.webm", { width: 1440, height: 900 }, true, async (page) => {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.goto(BASE + "/programs/yoga", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
});

console.log("production motion clips done — synthetic clips require MODE=synthetic server");
