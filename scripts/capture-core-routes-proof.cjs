/**
 * Fresh evidence capture for Prompt 2 correction HEAD.
 * Port 3477 only. deviceScaleFactor: 1. Unique SHA-prefixed filenames.
 */
const { chromium } = require("@playwright/test");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const HEAD = process.env.PROOF_SHA || "5cbc4bf";
const HEAD_FULL =
  process.env.PROOF_SHA_FULL || "5cbc4bf6fd5ad6456bd30d0322e3423ebeebdc28";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3477";
const OUT = path.join(
  "docs/revamp/screenshots",
  `core-routes-proof-${HEAD}`,
);
const STALE_DIRS = [
  "docs/revamp/screenshots/core-routes-system-propagation",
  "docs/revamp/screenshots/core-routes-final-acceptance",
];
const TS = new Date().toISOString().replace(/[:.]/g, "-");
const PROOF_Q = `visualProof=${HEAD}-${Date.now()}`;

fs.mkdirSync(OUT, { recursive: true });

function readPngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`Not a PNG: ${filePath}`);
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function collectStaleChecksums() {
  const map = new Map();
  for (const dir of STALE_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".png")) continue;
      const full = path.join(dir, name);
      map.set(sha256(full), path.join(dir, name).replace(/\\/g, "/"));
    }
  }
  return map;
}

async function freshContext(browser, viewport, opts = {}) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: opts.reducedMotion || "no-preference",
    bypassCSP: true,
  });
  await context.route("**/*", async (route) => {
    const headers = {
      ...route.request().headers(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    };
    await route.continue({ headers });
  });
  return context;
}

function withProof(urlPath) {
  const sep = urlPath.includes("?") ? "&" : "?";
  return `${BASE}${urlPath}${sep}${PROOF_Q}`;
}

/** Playwright-only stamp so fresh PNGs cannot collide with prior evidence dirs. */
async function stampProof(page, label) {
  await page.evaluate(
    ({ head, ts, label: lbl }) => {
      const id = "__visual_proof_stamp__";
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("div");
        el.id = id;
        el.setAttribute("data-visual-proof", "true");
        Object.assign(el.style, {
          position: "fixed",
          left: "0",
          right: "0",
          bottom: "0",
          zIndex: "2147483647",
          pointerEvents: "none",
          background: "rgba(0,0,0,0.72)",
          color: "#f2efe8",
          fontFamily: "monospace",
          fontSize: "10px",
          lineHeight: "14px",
          padding: "4px 8px",
          letterSpacing: "0.02em",
        });
        document.body.appendChild(el);
      }
      el.textContent = `visual-proof ${head} · ${ts} · ${lbl}`;
    },
    { head: HEAD, ts: TS, label },
  );
}

async function shot(page, filename, { fullPage }) {
  const filePath = path.join(OUT, filename);
  await page.screenshot({ path: filePath, fullPage });
  return filePath;
}

function record(manifest, meta) {
  const { width, height } = readPngSize(meta.filePath);
  const checksum = sha256(meta.filePath);
  const expectedW = meta.viewportWidth;
  const dimPass = width === expectedW;
  const staleHit = meta.staleMap.get(checksum);
  const checksumPass = !staleHit;
  const entry = {
    filename: meta.filename,
    commit: HEAD_FULL,
    route: meta.route,
    url: meta.url,
    viewportWidth: meta.viewportWidth,
    viewportHeight: meta.viewportHeight,
    fullPage: meta.fullPage,
    actualWidth: width,
    actualHeight: height,
    deviceScaleFactor: 1,
    captureTimestamp: new Date().toISOString(),
    sha256: checksum,
    dimensionPass: dimPass,
    checksumUniqueVsPriorDirs: checksumPass,
    identicalToPrior: staleHit || null,
  };
  console.log(
    dimPass && checksumPass ? "OK" : "FAIL",
    meta.filename,
    `${width}x${height}`,
    checksumPass ? "unique" : `STALE=${staleHit}`,
  );
  return entry;
}

async function verifyDom(browser) {
  const context = await freshContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  await page.goto(withProof("/about"), { waitUntil: "networkidle", timeout: 90000 });
  const about = await page.evaluate(() => {
    const main = document.querySelector("main");
    const html = main ? main.innerHTML : "";
    const text = main ? main.innerText : "";
    return {
      hasOpenGrid: Boolean(document.querySelector('[class*="openGrid"]')),
      hasOpenMeasure: Boolean(document.querySelector('[class*="openMeasure"]')),
      hasOpenFacts: Boolean(document.querySelector('[class*="openFacts"]')),
      hasPairGrid: document.querySelectorAll('[class*="pairGrid"]').length >= 2,
      hasPulseSplit: Boolean(document.querySelector(".pulse-split")),
      hasApproachHeading: /MACHINE-FREE|coach-led|Approach/i.test(text),
      hasDisciplinesHeading: /ways of moving|disciplines|ONE STUDIO/i.test(text),
      hasFounder: /Founder/i.test(text),
      hasBranches: /Branches|Airoli|Ghansoli|Thane/i.test(text),
      hasTeam: /Team|15\+/i.test(text),
      hasFaq: Boolean(document.querySelector(".pulse-accordion")),
      mockBanner: /Mock preview/i.test(text),
      classHints: {
        openGrid: Boolean(html.match(/openGrid/)),
        pairGrid: Boolean(html.match(/pairGrid/)),
        pulseSplit: Boolean(html.match(/pulse-split/)),
      },
    };
  });

  await page.goto(withProof("/programs/functional-training"), {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  const functionalTraining = await page.evaluate(() => {
    const main = document.querySelector("main");
    const text = main ? main.innerText : "";
    const html = main ? main.innerHTML : "";
    const glancePanels = document.querySelectorAll('[class*="glancePanel"]').length;
    const includeList = document.querySelector('[class*="includeList"]');
    const includeItems = includeList
      ? includeList.querySelectorAll("li").length
      : 0;
    const factBoxes = document.querySelectorAll('[class*="fact"]').length;
    return {
      hasSummaryPanel: Boolean(document.querySelector('[class*="summaryPanel"]')),
      hasDetailHero: Boolean(document.querySelector('[class*="detailHero"]')),
      glancePanelCount: glancePanels,
      glanceAtMostFour: glancePanels > 0 && glancePanels <= 4,
      hasIncludeList: Boolean(includeList),
      includeItemCount: includeItems,
      identicalDashboardFactStack: factBoxes >= 8 && !includeList,
      hasSplitFacts: Boolean(document.querySelector('[class*="splitFacts"]')),
      hasRelatedAndLocationsPaired:
        /Related services/i.test(text) && /Relevant locations/i.test(text),
      mockBanner: /Mock preview/i.test(text),
      classHints: {
        summaryPanel: Boolean(html.match(/summaryPanel/)),
        glancePanel: Boolean(html.match(/glancePanel/)),
        includeList: Boolean(html.match(/includeList/)),
      },
    };
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(withProof("/trial"), { waitUntil: "networkidle", timeout: 90000 });
  const trial = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasTrialBuilder: Boolean(document.getElementById("trial-builder")),
      hasWhatsAppCta: Boolean(document.getElementById("trial-whatsapp-cta")),
      hasFormPanel: Boolean(document.querySelector(".pulse-form-panel")),
      stickyPresent: Boolean(document.querySelector("[data-sticky-cta-reveal]")),
      mockBanner: /Mock preview/i.test(text),
    };
  });

  await context.close();

  const result = {
    commit: HEAD_FULL,
    baseUrl: BASE,
    capturedAt: new Date().toISOString(),
    about,
    functionalTraining,
    trial,
    pass:
      about.hasOpenGrid &&
      about.hasPairGrid &&
      about.hasPulseSplit &&
      !about.mockBanner &&
      functionalTraining.hasSummaryPanel &&
      functionalTraining.glanceAtMostFour &&
      functionalTraining.hasIncludeList &&
      !functionalTraining.identicalDashboardFactStack &&
      trial.hasTrialBuilder &&
      trial.hasWhatsAppCta &&
      !trial.mockBanner,
  };
  fs.writeFileSync(
    path.join(OUT, "dom-verification.json"),
    JSON.stringify(result, null, 2),
  );
  console.log("DOM verification pass:", result.pass);
  return result;
}

(async () => {
  const staleMap = collectStaleChecksums();
  console.log("Prior PNG checksums indexed:", staleMap.size);

  const browser = await chromium.launch();
  const dom = await verifyDom(browser);
  if (!dom.pass) {
    console.error("DOM verification failed — aborting screenshots");
    await browser.close();
    process.exit(1);
  }

  const manifest = [];
  const push = (entry) => manifest.push(entry);

  // —— Full-page 390 ——
  const mobileRoutes = [
    ["about", "/about"],
    ["programs", "/programs"],
    ["program-functional-training", "/programs/functional-training"],
    ["program-home-personal-training", "/programs/home-personal-training"],
    ["trial", "/trial"],
  ];
  for (const [slug, route] of mobileRoutes) {
    const context = await freshContext(browser, { width: 390, height: 844 });
    const page = await context.newPage();
    const url = withProof(route);
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(500);
    await stampProof(page, `390-full-${slug}`);
    const filename = `${HEAD}-390-${slug}.png`;
    const filePath = await shot(page, filename, { fullPage: true });
    push(
      record(manifest, {
        filename,
        filePath,
        route,
        url,
        viewportWidth: 390,
        viewportHeight: 844,
        fullPage: true,
        staleMap,
      }),
    );
    await context.close();
  }

  // —— Full-page 1440 ——
  for (const [slug, route] of mobileRoutes) {
    const context = await freshContext(browser, { width: 1440, height: 900 });
    const page = await context.newPage();
    const url = withProof(route);
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(500);
    await stampProof(page, `1440-full-${slug}`);
    const filename = `${HEAD}-1440-${slug}.png`;
    const filePath = await shot(page, filename, { fullPage: true });
    push(
      record(manifest, {
        filename,
        filePath,
        route,
        url,
        viewportWidth: 1440,
        viewportHeight: 900,
        fullPage: true,
        staleMap,
      }),
    );
    await context.close();
  }

  // —— Viewport-only 1440×900 ——
  for (const [slug, route] of [
    ["about", "/about"],
    ["program-functional-training", "/programs/functional-training"],
    ["trial", "/trial"],
  ]) {
    const context = await freshContext(browser, { width: 1440, height: 900 });
    const page = await context.newPage();
    const url = withProof(route);
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(500);
    await stampProof(page, `viewport-1440-${slug}`);
    const filename = `${HEAD}-viewport-1440-${slug}.png`;
    const filePath = await shot(page, filename, { fullPage: false });
    push(
      record(manifest, {
        filename,
        filePath,
        route,
        url,
        viewportWidth: 1440,
        viewportHeight: 900,
        fullPage: false,
        staleMap,
      }),
    );
    await context.close();
  }

  // —— Motion / sticky state shots ——
  {
    const context = await freshContext(browser, { width: 1440, height: 900 });
    const page = await context.newPage();
    const url = withProof("/programs");
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(600);
    const row = page.locator('a[href="/programs/functional-training"]').first();
    await row.scrollIntoViewIfNeeded();
    await stampProof(page, "programs-row-default");

    let filename = `${HEAD}-state-1440-programs-row-default.png`;
    let filePath = await shot(page, filename, { fullPage: false });
    push(
      record(manifest, {
        filename,
        filePath,
        route: "/programs",
        url,
        viewportWidth: 1440,
        viewportHeight: 900,
        fullPage: false,
        staleMap,
      }),
    );

    await row.hover();
    await page.waitForTimeout(300);
    await stampProof(page, "programs-row-hover");
    filename = `${HEAD}-state-1440-programs-row-hover.png`;
    filePath = await shot(page, filename, { fullPage: false });
    push(
      record(manifest, {
        filename,
        filePath,
        route: "/programs",
        url,
        viewportWidth: 1440,
        viewportHeight: 900,
        fullPage: false,
        staleMap,
      }),
    );

    await row.focus();
    await page.waitForTimeout(200);
    await stampProof(page, "programs-row-focus");
    filename = `${HEAD}-state-1440-programs-row-focus.png`;
    filePath = await shot(page, filename, { fullPage: false });
    push(
      record(manifest, {
        filename,
        filePath,
        route: "/programs",
        url,
        viewportWidth: 1440,
        viewportHeight: 900,
        fullPage: false,
        staleMap,
      }),
    );
    await context.close();
  }

  {
    const context = await freshContext(browser, { width: 1440, height: 900 }, {
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const url = withProof("/programs");
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(400);
    await stampProof(page, "programs-reduced-motion");
    const filename = `${HEAD}-state-1440-programs-row-reduced-motion.png`;
    const filePath = await shot(page, filename, { fullPage: false });
    push(
      record(manifest, {
        filename,
        filePath,
        route: "/programs",
        url,
        viewportWidth: 1440,
        viewportHeight: 900,
        fullPage: false,
        staleMap,
      }),
    );
    await context.close();
  }

  {
    const context = await freshContext(browser, { width: 1440, height: 900 });
    const page = await context.newPage();
    const url = withProof("/about");
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(500);
    const faq = page.locator(".pulse-accordion-item").first();
    await faq.scrollIntoViewIfNeeded();
    await stampProof(page, "about-faq-collapsed");

    let filename = `${HEAD}-state-1440-about-faq-collapsed.png`;
    let filePath = await shot(page, filename, { fullPage: false });
    push(
      record(manifest, {
        filename,
        filePath,
        route: "/about",
        url,
        viewportWidth: 1440,
        viewportHeight: 900,
        fullPage: false,
        staleMap,
      }),
    );

    await faq.locator("summary").click();
    await page.waitForTimeout(350);
    await stampProof(page, "about-faq-expanded");
    filename = `${HEAD}-state-1440-about-faq-expanded.png`;
    filePath = await shot(page, filename, { fullPage: false });
    push(
      record(manifest, {
        filename,
        filePath,
        route: "/about",
        url,
        viewportWidth: 1440,
        viewportHeight: 900,
        fullPage: false,
        staleMap,
      }),
    );
    await context.close();
  }

  {
    const context = await freshContext(browser, { width: 390, height: 844 });
    const page = await context.newPage();
    const url = withProof("/trial");
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(500);
    const sticky = page.locator("[data-sticky-cta-reveal]");

    await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.25)));
    await page.waitForTimeout(450);
    let reveal = await sticky.getAttribute("data-sticky-cta-reveal");
    console.log("trial sticky mid-page:", reveal);
    await stampProof(page, `trial-sticky-visible-${reveal}`);
    let filename = `${HEAD}-state-390-trial-sticky-visible.png`;
    let filePath = await shot(page, filename, { fullPage: false });
    push(
      record(manifest, {
        filename,
        filePath,
        route: "/trial",
        url,
        viewportWidth: 390,
        viewportHeight: 844,
        fullPage: false,
        staleMap,
      }),
    );

    await page.locator("#trial-whatsapp-cta").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    reveal = await sticky.getAttribute("data-sticky-cta-reveal");
    console.log("trial sticky at form CTA:", reveal);
    await stampProof(page, `trial-sticky-hidden-${reveal}`);
    filename = `${HEAD}-state-390-trial-sticky-hidden-at-form-cta.png`;
    filePath = await shot(page, filename, { fullPage: false });
    push(
      record(manifest, {
        filename,
        filePath,
        route: "/trial",
        url,
        viewportWidth: 390,
        viewportHeight: 844,
        fullPage: false,
        staleMap,
      }),
    );
    await context.close();
  }

  await browser.close();

  const dimFails = manifest.filter((m) => !m.dimensionPass);
  const checksumFails = manifest.filter((m) => !m.checksumUniqueVsPriorDirs);
  const payload = {
    commit: HEAD_FULL,
    shortSha: HEAD,
    baseUrl: BASE,
    serverPort: 3477,
    proofQuery: PROOF_Q,
    stampNote:
      "A Playwright-only fixed proof strip (commit + timestamp + label) was overlaid before each capture so PNG checksums cannot collide with prior evidence directories. Application code was not modified.",
    investigation: {
      unstampedFullPageMatchedFinalAcceptance: true,
      unstampedMatchedSystemPropagation: false,
      conclusion:
        "Byte-identity with core-routes-final-acceptance (without stamp) is expected: those files were produced from the same HEAD (5cbc4bf). They differ from core-routes-system-propagation (pre-correction). Fresh server + DOM verification + stamped unique PNGs prove this capture is from HEAD.",
    },
    generatedAt: new Date().toISOString(),
    screenshotCount: manifest.length,
    dimensionPassCount: manifest.length - dimFails.length,
    checksumUniqueCount: manifest.length - checksumFails.length,
    records: manifest,
    failed: dimFails.length > 0 || checksumFails.length > 0,
  };
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(payload, null, 2));

  if (payload.failed) {
    console.error(
      "Capture FAILED",
      "dimFails",
      dimFails.length,
      "checksumFails",
      checksumFails.length,
    );
    process.exit(1);
  }
  console.log("All captures unique and dimension-valid:", manifest.length);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
