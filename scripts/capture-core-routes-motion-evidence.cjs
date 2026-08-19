/**
 * Motion + sticky CTA evidence for Prompt 2 final acceptance.
 * Traces → docs/revamp/traces/core-routes-final-acceptance/
 * State screenshots → docs/revamp/screenshots/core-routes-final-acceptance/ (1440 native)
 */
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const TRACE_OUT = path.join("docs/revamp/traces/core-routes-final-acceptance");
const SHOT_OUT = path.join("docs/revamp/screenshots/core-routes-final-acceptance");

fs.mkdirSync(TRACE_OUT, { recursive: true });
fs.mkdirSync(SHOT_OUT, { recursive: true });

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

async function withTrace(browser, name, viewport, reducedMotion, fn) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: false });
  const page = await context.newPage();
  try {
    await fn(page);
  } finally {
    await context.tracing.stop({
      path: path.join(TRACE_OUT, `${name}.zip`),
    });
    await context.close();
    console.log("trace", name);
  }
}

(async () => {
  const browser = await chromium.launch();

  // —— Programmes index ——
  await withTrace(browser, "programs-opening-hover-focus", DESKTOP, false, async (page) => {
    await page.goto(BASE + "/programs", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);

    const rows = [
      "/programs/functional-training",
      "/programs/yoga",
      "/programs/home-personal-training",
      "/programs/wedding-choreography",
    ];
    for (const href of rows) {
      const row = page.locator(`a[href="${href}"]`).first();
      await row.scrollIntoViewIfNeeded();
      await row.hover();
      await page.waitForTimeout(280);
      await page.screenshot({
        path: path.join(SHOT_OUT, `state-1440-programs-hover-${href.split("/").pop()}.png`),
        fullPage: false,
      });
      await row.focus();
      await page.waitForTimeout(200);
      await page.screenshot({
        path: path.join(SHOT_OUT, `state-1440-programs-focus-${href.split("/").pop()}.png`),
        fullPage: false,
      });
    }
  });

  await withTrace(browser, "programs-reduced-motion", DESKTOP, true, async (page) => {
    await page.goto(BASE + "/programs", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SHOT_OUT, "state-1440-programs-reduced-motion.png"),
      fullPage: false,
    });
  });

  // —— About ——
  await withTrace(browser, "about-opening-reveal-faq", DESKTOP, false, async (page) => {
    await page.goto(BASE + "/about", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await page.locator("#about-approach-disciplines").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const faq = page.locator(".pulse-accordion-item").first();
    if (await faq.count()) {
      await faq.locator("summary").click();
      await page.waitForTimeout(350);
      await page.screenshot({
        path: path.join(SHOT_OUT, "state-1440-about-faq-open.png"),
        fullPage: false,
      });
      await faq.locator("summary").click();
      await page.waitForTimeout(350);
      await page.screenshot({
        path: path.join(SHOT_OUT, "state-1440-about-faq-closed.png"),
        fullPage: false,
      });
    }
  });

  await withTrace(browser, "about-reduced-motion", DESKTOP, true, async (page) => {
    await page.goto(BASE + "/about", { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(SHOT_OUT, "state-1440-about-reduced-motion.png"),
      fullPage: false,
    });
  });

  // —— Trial (mobile sticky hide/show + form focus) ——
  await withTrace(browser, "trial-sticky-and-form", MOBILE, false, async (page) => {
    await page.goto(BASE + "/trial", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const sticky = page.locator('[data-sticky-cta-reveal]');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const topReveal = await sticky.getAttribute("data-sticky-cta-reveal");
    console.log("trial sticky at top:", topReveal);

    await page.locator("#name").focus();
    await page.waitForTimeout(200);
    await page.locator("#branchSlug").focus();
    await page.waitForTimeout(200);

    await page.locator("#trial-whatsapp-cta").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const bottomReveal = await sticky.getAttribute("data-sticky-cta-reveal");
    console.log("trial sticky at WhatsApp CTA:", bottomReveal);

    await page.screenshot({
      path: path.join(SHOT_OUT, "state-390-trial-sticky-at-form-cta.png"),
      fullPage: false,
    });

    // Press WhatsApp CTA (opens blank — allow popup)
    const [popup] = await Promise.all([
      page.waitForEvent("popup", { timeout: 5000 }).catch(() => null),
      page.locator("#trial-whatsapp-cta").click({ force: true }),
    ]);
    if (popup) await popup.close();

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    console.log(
      "trial sticky after scroll top:",
      await sticky.getAttribute("data-sticky-cta-reveal"),
    );
  });

  await browser.close();
  console.log("Motion evidence complete.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
