const { chromium } = require("@playwright/test");
const path = require("path");

const out = path.join("docs/revamp/screenshots/shared-system-homepage-repair");
const base = "http://localhost:3000";

async function shot(browser, name, url, w, h, full = false) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(base + url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(out, name), fullPage: full });
  await page.close();
  console.log("ok", name);
}

(async () => {
  const browser = await chromium.launch();

  await shot(browser, "after-390-home.png", "/", 390, 844);
  await shot(browser, "after-768-home.png", "/", 768, 1024);
  await shot(browser, "after-1440-home.png", "/", 1440, 900);
  await shot(browser, "after-1440-fullpage-home.png", "/", 1440, 900, true);
  await shot(browser, "after-1440-programmes-shared-components.png", "/programs", 1440, 900);
  await shot(browser, "after-1440-contact-shared-chrome.png", "/contact", 1440, 900);

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const serviceRows = page.locator("#services a[href^='/programs/']");
  const count = await serviceRows.count();
  console.log("programme rows", count);

  if (count > 0) {
    await serviceRows.nth(0).hover();
    await page.screenshot({ path: path.join(out, "state-programme-hover-ft.png") });
    await serviceRows.nth(0).focus();
    await page.screenshot({ path: path.join(out, "state-programme-focus-ft.png") });
    for (let i = 0; i < count; i++) {
      await serviceRows.nth(i).hover();
      await page.waitForTimeout(80);
    }
    await page.screenshot({ path: path.join(out, "state-programme-hover-last.png") });
  }

  await page.locator("#faq details").first().click();
  await page.waitForTimeout(250);
  await page.locator("#faq").screenshot({ path: path.join(out, "state-faq-open.png") });

  const html = await page.content();
  const fails = [];
  if (/open neighbourhood studio/i.test(html)) fails.push("neighbourhood phrase");
  if (/Trainers|Member stories|Blog/i.test(await page.locator("footer").innerText())) {
    fails.push("withheld footer links");
  }
  console.log(fails.length ? "FAIL " + fails.join(", ") : "content checks ok");

  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto(base + "/", { waitUntil: "networkidle" });
  const menuBtn = mob.getByRole("button", { name: /menu|open navigation|open menu/i }).first();
  if ((await menuBtn.count()) > 0) {
    await menuBtn.click();
    await mob.waitForTimeout(350);
    await mob.screenshot({ path: path.join(out, "state-mobile-menu-open.png") });
  } else {
    console.log("mobile menu button not found");
  }

  const rm = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await rm.goto(base + "/", { waitUntil: "networkidle" });
  await rm.waitForTimeout(400);
  await rm.screenshot({ path: path.join(out, "state-reduced-motion-home.png") });

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
