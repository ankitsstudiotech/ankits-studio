/**
 * Stage 3 correction evidence — premium-stage-3-correction/
 * Usage: PLAYWRIGHT_BASE_URL=http://localhost:PORT node docs/revamp/_capture-premium-stage-3-correction.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE =
  process.env.PLAYWRIGHT_BASE_URL || process.env.AUDIT_BASE_URL || "http://localhost:3000";
const OUT = path.resolve("docs/revamp/motion/premium-stage-3-correction");

fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) {
  fs.unlinkSync(path.join(OUT, f));
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

/** Keep the recording clock alive during long holds (Playwright can drop idle time). */
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

async function withVideo(browser, name, size, fn, options = {}) {
  const context = await browser.newContext({
    viewport: size,
    recordVideo: { dir: OUT, size },
    reducedMotion: options.reducedMotion || "no-preference",
    javaScriptEnabled: options.javaScriptEnabled !== false,
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
      const dest = path.join(OUT, `${name}.webm`);
      if (src && fs.existsSync(src)) {
        fs.renameSync(src, dest);
      }
    }
  }
}

async function hoverPair(page, selector, baseName) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await pause(250);
  const box = await el.boundingBox();
  if (!box) return;
  await page.screenshot({ path: path.join(OUT, `${baseName}-default.png`), clip: box });
  await el.hover({ force: true });
  await pause(550);
  await page.screenshot({
    path: path.join(OUT, `${baseName}-hover.png`),
    clip: await el.boundingBox(),
  });
  await page.mouse.move(0, 0);
  await pause(250);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const desktop = { width: 1440, height: 900 };
  const mobile = { width: 390, height: 844 };

  // —— First-paint + hero timing (normal) ——
  {
    const context = await browser.newContext({ viewport: desktop, colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "commit" });
    await page.waitForSelector("#home-hero-title", { state: "attached", timeout: 10000 });
    await page.screenshot({ path: path.join(OUT, "first-paint-normal-home.png") });

    await page.goto(BASE + "/", { waitUntil: "commit" });
    const t0 = Date.now();
    for (const [file, ms] of [
      ["hero-100ms.png", 100],
      ["hero-250ms.png", 250],
      ["hero-450ms.png", 450],
      ["hero-700ms.png", 700],
      ["hero-final.png", 1100],
    ]) {
      await pause(Math.max(0, ms - (Date.now() - t0)));
      await page.screenshot({ path: path.join(OUT, file) });
    }
    await context.close();
  }

  // —— First-paint reduced ——
  {
    const context = await browser.newContext({
      viewport: desktop,
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#home-hero-title");
    await page.screenshot({ path: path.join(OUT, "first-paint-reduced-home.png") });
    await context.close();
  }

  // —— First-paint JS disabled ——
  {
    const context = await browser.newContext({
      viewport: desktop,
      colorScheme: "dark",
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "load" });
    await page.waitForSelector("#home-hero-title", { state: "attached" });
    await pause(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(OUT, "first-paint-js-disabled-home.png") });
    await context.close();
  }

  // —— A. homepage-desktop.webm (~14–16s) ——
  await withVideo(browser, "homepage-desktop", desktop, async (page) => {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await hold(page, 1600);
    await page.locator("#services").scrollIntoViewIfNeeded();
    await pause(900);
    for (const slug of [
      "functional-training",
      "zumba",
      "yoga",
      "adult-dance",
      "wedding-choreography",
    ]) {
      const row = page.locator(`a[href="/programs/${slug}"]`).first();
      await row.scrollIntoViewIfNeeded();
      await row.hover();
      await hold(page, 750);
    }
    await page.locator("#studio").scrollIntoViewIfNeeded();
    await hold(page, 1100);
    await page.locator("#locations").scrollIntoViewIfNeeded();
    await hold(page, 700);
    const branch = page.locator("#locations a[href*='/locations/']").first();
    if (await branch.count()) {
      await branch.hover();
      await hold(page, 700);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await hold(page, 500);
    const cta = page.locator("#home-hero-primary-cta").first();
    if (await cta.count()) {
      await cta.hover();
      await hold(page, 600);
      await cta.dispatchEvent("mousedown");
      await pause(250);
      await cta.dispatchEvent("mouseup");
    }
    await hold(page, 600);
  });

  // —— B. homepage-mobile.webm (~12s) ——
  await withVideo(browser, "homepage-mobile", mobile, async (page) => {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await hold(page, 1800);
    await page.mouse.wheel(0, 700);
    await hold(page, 1000);
    const row = page.locator('a[href="/programs/functional-training"]').first();
    await row.scrollIntoViewIfNeeded();
    await row.tap().catch(() => row.click());
    await hold(page, 1000);
    await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});
    await hold(page, 1000);
    await page.mouse.wheel(0, 500);
    await hold(page, 900);
    await page.getByRole("button", { name: /Open menu/i }).click();
    await hold(page, 1200);
    await page.keyboard.press("Escape");
    await hold(page, 1200);
  });

  // —— C. programs-personalities.webm (~12s) ——
  await withVideo(browser, "programs-personalities", desktop, async (page) => {
    await page.goto(BASE + "/programs", { waitUntil: "networkidle" });
    await hold(page, 700);
    for (const slug of [
      "functional-training",
      "home-personal-training",
      "online-training",
      "zumba",
      "yoga",
      "adult-dance",
      "wedding-choreography",
    ]) {
      const row = page.locator(`a[href="/programs/${slug}"]`).first();
      await row.scrollIntoViewIfNeeded();
      await row.hover();
      await hold(page, 850);
      await page.mouse.move(12, 12);
      await pause(250);
    }
  });

  // —— D. programme-openings.webm (~14s) ——
  await withVideo(browser, "programme-openings", desktop, async (page) => {
    for (const slug of ["functional-training", "yoga", "wedding-choreography"]) {
      await page.goto(BASE + `/programs/${slug}`, { waitUntil: "networkidle" });
      await hold(page, 3800);
    }
  });

  // —— E. forms-and-ui.webm (~10s) ——
  await withVideo(browser, "forms-and-ui", mobile, async (page) => {
    await page.goto(BASE + "/pricing", { waitUntil: "networkidle" });
    await hold(page, 1200);
    const name = page.locator('input[name="name"], input[id*="name"]').first();
    if (await name.count()) {
      await name.focus();
      await name.fill("Aniket");
      await hold(page, 1100);
    }
    const phone = page.locator('input[name="phone"], input[type="tel"]').first();
    if (await phone.count()) {
      await phone.focus();
      await phone.fill("9876543210");
      await hold(page, 1100);
    }
    const select = page.locator("select").first();
    if (await select.count()) {
      await select.focus();
      await hold(page, 800);
    }
    const submit = page
      .getByRole("button")
      .filter({ hasText: /WhatsApp|Send|Enquire|Submit/i })
      .first();
    if (await submit.count()) {
      await submit.hover().catch(() => {});
      await submit.dispatchEvent("mousedown");
      await pause(400);
      await submit.dispatchEvent("mouseup");
    }
    await page.mouse.wheel(0, 700);
    await hold(page, 3700);
  });

  // —— F. reduced-motion.webm (~8s) ——
  await withVideo(
    browser,
    "reduced-motion",
    desktop,
    async (page) => {
      await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
      await hold(page, 2000);
      await page.mouse.wheel(0, 900);
      await hold(page, 1400);
      await page.goto(BASE + "/programs/yoga", { waitUntil: "domcontentloaded" });
      await hold(page, 2000);
      const link = page.locator('a[href="/programs"]').first();
      if (await link.count()) await link.hover().catch(() => {});
      await hold(page, 1400);
    },
    { reducedMotion: "reduce" },
  );

  // —— Paired interaction proofs ——
  {
    const context = await browser.newContext({ viewport: desktop, colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await pause(1000);
    await page.locator("#services").scrollIntoViewIfNeeded();
    await pause(400);
    await hoverPair(page, 'a[href="/programs/functional-training"]', "functional");
    await hoverPair(page, 'a[href="/programs/zumba"]', "zumba");
    await hoverPair(page, 'a[href="/programs/yoga"]', "yoga");
    await hoverPair(page, 'a[href="/programs/adult-dance"]', "dance");
    await hoverPair(page, 'a[href="/programs/wedding-choreography"]', "wedding");

    await page.locator("#locations").scrollIntoViewIfNeeded();
    await pause(400);
    const branchSel = "#locations a[href*='/locations/']";
    if (await page.locator(branchSel).count()) {
      await hoverPair(page, branchSel, "branch");
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await pause(400);
    const cta = page.locator("#home-hero-primary-cta").first();
    if (await cta.count()) {
      const box = await cta.boundingBox();
      if (box) {
        await page.screenshot({ path: path.join(OUT, "primary-cta-default.png"), clip: box });
        await cta.hover();
        await pause(450);
        await page.screenshot({
          path: path.join(OUT, "primary-cta-hover.png"),
          clip: (await cta.boundingBox()) || box,
        });
      }
    }
    await context.close();
  }

  for (const f of fs.readdirSync(OUT)) {
    if (f.startsWith("page@") && f.endsWith(".webm")) {
      fs.unlinkSync(path.join(OUT, f));
    }
  }

  const files = fs.readdirSync(OUT).sort();
  const manifest = {
    base: BASE,
    generatedAt: new Date().toISOString(),
    files: files.map((f) => {
      const st = fs.statSync(path.join(OUT, f));
      return { name: f, bytes: st.size };
    }),
  };
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("Evidence written to", OUT);
  console.log(manifest.files.map((f) => `${f.name} (${f.bytes})`).join("\n"));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
