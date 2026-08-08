/**
 * Stage 3 — motion evidence: Playwright videos + interaction PNGs.
 * deviceScaleFactor: 1
 */
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3493";
const OUT = path.join("docs/revamp/motion/premium-stage-3");
const SHOT = path.join("docs/revamp/screenshots/premium-stage-3-motion");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(SHOT, { recursive: true });

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

(async () => {
  const browser = await chromium.launch();
  const records = [];

  // —— Videos ——
  async function record(name, size, reduced, script, touch = false) {
    const ctx = await browser.newContext({
      viewport: size,
      deviceScaleFactor: 1,
      reducedMotion: reduced ? "reduce" : "no-preference",
      hasTouch: touch,
      isMobile: touch,
      recordVideo: { dir: OUT, size },
    });
    const page = await ctx.newPage();
    await script(page);
    await ctx.close();
    // Rename video
    const files = fs.readdirSync(OUT).filter((f) => f.endsWith(".webm"));
    const newest = files
      .map((f) => ({ f, t: fs.statSync(path.join(OUT, f)).mtimeMs }))
      .sort((a, b) => b.t - a.t)[0];
    if (newest) {
      const dest = path.join(OUT, name);
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      fs.renameSync(path.join(OUT, newest.f), dest);
      console.log("video", name);
    }
  }

  await record("homepage-desktop.webm", { width: 1440, height: 900 }, false, async (page) => {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await sleep(1200);
    await page.mouse.wheel(0, 400);
    await sleep(600);
    await page.mouse.wheel(0, 500);
    await sleep(500);
    const ft = page.locator('a[href="/programs/functional-training"]').first();
    await ft.hover();
    await sleep(500);
    await page.locator('a[href="/programs/zumba"]').first().hover();
    await sleep(450);
    await page.locator('a[href="/programs/yoga"]').first().hover();
    await sleep(450);
    await page.locator('a[href="/programs/wedding-choreography"]').first().hover();
    await sleep(500);
    await page.locator("#studio").scrollIntoViewIfNeeded();
    await sleep(700);
    await page.locator("#locations").scrollIntoViewIfNeeded();
    await sleep(400);
    await page.locator("#locations article").first().hover();
    await sleep(500);
    await page.locator("#home-hero-primary-cta").hover();
    await sleep(600);
  });

  await record("homepage-mobile.webm", { width: 390, height: 844 }, false, async (page) => {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await sleep(1000);
    await page.mouse.wheel(0, 600);
    await sleep(500);
    await page.locator('a[href="/programs/functional-training"]').first().click();
    await sleep(400);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await sleep(400);
    await page.mouse.wheel(0, 1200);
    await sleep(600);
    await page.getByRole("button", { name: /Open menu/i }).click();
    await sleep(500);
    await page.keyboard.press("Escape");
    await sleep(400);
  }, true);

  await record("programs-desktop.webm", { width: 1440, height: 900 }, false, async (page) => {
    await page.goto(BASE + "/programs", { waitUntil: "networkidle" });
    await sleep(800);
    for (const href of [
      "/programs/functional-training",
      "/programs/zumba",
      "/programs/yoga",
      "/programs/adult-dance",
      "/programs/wedding-choreography",
    ]) {
      await page.locator(`a[href="${href}"]`).first().hover();
      await sleep(450);
    }
  });

  await record("programme-details.webm", { width: 1440, height: 900 }, false, async (page) => {
    for (const slug of ["functional-training", "yoga", "wedding-choreography"]) {
      await page.goto(BASE + `/programs/${slug}`, { waitUntil: "networkidle" });
      await sleep(1100);
      await page.mouse.wheel(0, 300);
      await sleep(400);
    }
  });

  await record("forms.webm", { width: 390, height: 844 }, false, async (page) => {
    await page.goto(BASE + "/pricing", { waitUntil: "networkidle" });
    await sleep(600);
    await page.locator("#pricing-enquiry").scrollIntoViewIfNeeded();
    await sleep(500);
    const select = page.locator("#pricing-enquiry select").first();
    if (await select.count()) {
      await select.focus();
      await sleep(300);
      await select.selectOption({ index: 1 }).catch(() => {});
      await sleep(400);
    }
    await page.locator("#pricing-enquiry a, #pricing-enquiry button").last().hover().catch(() => {});
    await sleep(500);
  }, true);

  await record("reduced-motion.webm", { width: 1440, height: 900 }, true, async (page) => {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await sleep(600);
    await page.goto(BASE + "/programs/yoga", { waitUntil: "networkidle" });
    await sleep(600);
  });

  // —— Interaction PNGs ——
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await sleep(800);

  async function shot(name, locator, action) {
    const el = page.locator(locator).first();
    await el.scrollIntoViewIfNeeded();
    if (action === "hover") await el.hover();
    if (action === "focus") await el.focus();
    await sleep(250);
    const file = path.join(OUT, `${name}.png`);
    await el.screenshot({ path: file });
    console.log("png", name);
  }

  await shot("train-default", 'a[href="/programs/functional-training"]', "none");
  await shot("train-hover", 'a[href="/programs/functional-training"]', "hover");
  await shot("yoga-hover", 'a[href="/programs/yoga"]', "hover");
  await shot("dance-hover", 'a[href="/programs/adult-dance"]', "hover");
  await shot("wedding-hover", 'a[href="/programs/wedding-choreography"]', "hover");
  await page.locator("#locations").scrollIntoViewIfNeeded();
  await shot("branch-hover", "#locations article", "hover");
  await shot("primary-cta-hover", "#home-hero-primary-cta", "hover");
  await shot("keyboard-focus", 'a[href="/programs/yoga"]', "focus");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Open menu/i }).click();
  await sleep(400);
  await page.screenshot({ path: path.join(OUT, "mobile-menu-open.png") });
  await ctx.close();

  // —— Full-page screenshots ——
  const routes = [
    ["home", "/"],
    ["about", "/about"],
    ["programs", "/programs"],
    ["functional-training", "/programs/functional-training"],
    ["yoga", "/programs/yoga"],
    ["wedding", "/programs/wedding-choreography"],
    ["locations", "/locations"],
    ["pricing", "/pricing"],
    ["timetable", "/timetable"],
    ["trial", "/trial"],
    ["contact", "/contact"],
  ];

  for (const [slug, route] of routes) {
    for (const [w, h, tag] of [
      [390, 844, "390"],
      [1440, 900, "1440"],
    ]) {
      const c = await browser.newContext({
        viewport: { width: w, height: h },
        deviceScaleFactor: 1,
      });
      const p = await c.newPage();
      await p.goto(BASE + route, { waitUntil: "networkidle", timeout: 90000 });
      await sleep(400);
      const file = path.join(SHOT, `full-${tag}-${slug}.png`);
      await p.screenshot({ path: file, fullPage: true });
      const { width, height } = pngSize(file);
      const pass = width === w;
      records.push({ name: path.basename(file), width, height, expected: w, pass });
      console.log(pass ? "ok" : "FAIL", path.basename(file), `${width}x${height}`);
      await c.close();
    }
  }

  for (const [slug, route] of [
    ["home", "/"],
    ["programs", "/programs"],
    ["functional-training", "/programs/functional-training"],
    ["pricing", "/pricing"],
  ]) {
    const c = await browser.newContext({
      viewport: { width: 768, height: 1024 },
      deviceScaleFactor: 1,
    });
    const p = await c.newPage();
    await p.goto(BASE + route, { waitUntil: "networkidle" });
    await sleep(350);
    const file = path.join(SHOT, `full-768-${slug}.png`);
    await p.screenshot({ path: file, fullPage: true });
    const { width, height } = pngSize(file);
    records.push({ name: path.basename(file), width, height, expected: 768, pass: width === 768 });
    console.log(width === 768 ? "ok" : "FAIL", path.basename(file));
    await c.close();
  }

  await browser.close();
  const fails = records.filter((r) => !r.pass).length;
  fs.writeFileSync(
    path.join(SHOT, "manifest.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, fails, records }, null, 2),
  );
  fs.writeFileSync(
    path.join(OUT, "manifest.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), videos: fs.readdirSync(OUT).filter((f) => f.endsWith(".webm")) }, null, 2),
  );
  console.log("screenshot fails", fails);
  if (fails) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
