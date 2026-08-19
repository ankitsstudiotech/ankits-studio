/**
 * Pre-fix CLS / overflow instrumentation against a production `next start` server.
 * Usage: BASE_URL=http://localhost:3006 node docs/performance/stage-3-ai-cls-correction/_instrument-cls.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium, devices } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3006";
const OUT = join(process.cwd(), "docs/performance/stage-3-ai-cls-correction");
const SHOTS = join(OUT, "timeline");

const SHIFT_OBSERVER = `(() => {
  window.__layoutShifts = [];
  try {
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        const sources = [];
        for (const src of entry.sources || []) {
          const node = src.node;
          let identity = null;
          if (node && node.nodeType === 1) {
            const el = node;
            const id = el.id ? "#" + el.id : "";
            const cls = el.className && typeof el.className === "string"
              ? "." + el.className.trim().split(/\\s+/).slice(0, 3).join(".")
              : "";
            identity = {
              tag: el.tagName,
              selector: el.tagName.toLowerCase() + id + cls,
              slot: el.getAttribute("data-media-slot"),
              status: el.getAttribute("data-media-status"),
            };
          }
          sources.push({
            identity,
            previousRect: src.previousRect
              ? { x: src.previousRect.x, y: src.previousRect.y, w: src.previousRect.width, h: src.previousRect.height }
              : null,
            currentRect: src.currentRect
              ? { x: src.currentRect.x, y: src.currentRect.y, w: src.currentRect.width, h: src.currentRect.height }
              : null,
          });
        }
        window.__layoutShifts.push({
          value: entry.value,
          startTime: entry.startTime,
          sources,
        });
      }
    });
    po.observe({ type: "layout-shift", buffered: true });
    window.__layoutShiftObserver = po;
  } catch (e) {
    window.__layoutShiftError = String(e);
  }
})()`;

function selectorFromEl(el) {
  return el;
}

async function collectShifts(page, path, viewport) {
  await page.addInitScript(SHIFT_OBSERVER);
  await page.setViewportSize(viewport);
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(5000);
  const payload = await page.evaluate(() => {
    const shifts = window.__layoutShifts || [];
    const total = shifts.reduce((sum, s) => sum + s.value, 0);
    const h1 = document.querySelector("h1");
    const h1Style = h1 ? getComputedStyle(h1) : null;
    const heroMedia = document.querySelector("[data-media-slot='home.hero'], [data-media-slot^='programme.']");
    const heroRect = heroMedia ? heroMedia.getBoundingClientRect() : null;
    const figure = document.querySelector("figure[data-media-slot]");
    const figureStyle = figure ? getComputedStyle(figure) : null;
    const img = figure?.querySelector("img");
    return {
      totalCls: total,
      shiftCount: shifts.length,
      shifts: shifts.sort((a, b) => b.value - a.value),
      h1: h1
        ? {
            text: h1.textContent?.trim(),
            opacity: h1Style.opacity,
            visibility: h1Style.visibility,
            width: h1.getBoundingClientRect().width,
            height: h1.getBoundingClientRect().height,
          }
        : null,
      heroGeometry: figure
        ? {
            slot: figure.getAttribute("data-media-slot"),
            aspectRatio: figureStyle.aspectRatio,
            width: figureStyle.width,
            height: figureStyle.height,
            minHeight: figureStyle.minHeight,
            maxHeight: figureStyle.maxHeight,
            imgNatural: img ? { w: img.naturalWidth, h: img.naturalHeight, complete: img.complete } : null,
            imgClient: img ? { w: img.clientWidth, h: img.clientHeight } : null,
          }
        : null,
      heroRect,
      bodyPaddingBottom: getComputedStyle(document.body).paddingBottom,
      hasStickyClass: document.body.classList.contains("has-sticky-cta"),
      htmlClasses: [...document.documentElement.classList],
    };
  });
  return payload;
}

async function captureTimeline(page, path, outName) {
  await page.setViewportSize({ width: 390, height: 844 });
  const times = [0, 100, 250, 500, 750, 1000, 1500, 2500];
  await page.goto(`${BASE}${path}`, { waitUntil: "commit", timeout: 120_000 });
  const start = Date.now();
  for (const t of times) {
    const wait = t - (Date.now() - start);
    if (wait > 0) await page.waitForTimeout(wait);
    await page.screenshot({ path: join(SHOTS, `${outName}-${String(t).padStart(4, "0")}ms.png`) });
  }
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(SHOTS, `${outName}-final.png`) });
}

async function composeContactSheet(browser) {
  const { readdir } = await import("node:fs/promises");
  const files = (await readdir(SHOTS))
    .filter((f) => f.startsWith("home-") && f.endsWith(".png"))
    .sort();
  const page = await browser.newPage();
  const cells = [];
  for (const file of files) {
    const buf = await (await import("node:fs/promises")).readFile(join(SHOTS, file));
    cells.push({
      label: file.replace("home-", "").replace(".png", ""),
      src: `data:image/png;base64,${buf.toString("base64")}`,
    });
  }
  const html = `<!DOCTYPE html><html><head><style>
    body{margin:0;background:#0b0b0c;color:#e8e4dc;font-family:system-ui;padding:12px}
    h1{font-size:14px;letter-spacing:.08em;text-transform:uppercase}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    figure{margin:0;border:1px solid #2a2a2e}
    img{width:100%;height:220px;object-fit:cover;object-position:top;display:block}
    figcaption{font-size:11px;padding:6px;background:#111}
  </style></head><body>
  <h1>Home mobile layout-shift timeline</h1>
  <div class="grid">${cells
    .map((c) => `<figure><img src="${c.src}" alt="${c.label}"/><figcaption>${c.label}</figcaption></figure>`)
    .join("")}</div></body></html>`;
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.setContent(html, { waitUntil: "load" });
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  await page.screenshot({
    path: join(OUT, "home-layout-shift-timeline.png"),
    fullPage: true,
  });
  await page.close();
}

async function overflowAudit(page) {
  const widths = [360, 390, 430, 768, 1024, 1280, 1440, 1920];
  const results = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 120_000 });
    const metrics = await page.evaluate(() => {
      const clientWidth = document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > clientWidth + 1 || r.left < -1);
        })
        .slice(0, 25)
        .map((el) => {
          const r = el.getBoundingClientRect();
          const id = el.id ? "#" + el.id : "";
          const cls =
            el.className && typeof el.className === "string"
              ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
              : "";
          return {
            selector: el.tagName.toLowerCase() + id + cls,
            slot: el.getAttribute("data-media-slot"),
            left: r.left,
            right: r.right,
            width: r.width,
            overflowRight: r.right - clientWidth,
            overflowLeft: r.left,
          };
        });
      return {
        innerWidth: window.innerWidth,
        clientWidth: document.documentElement.clientWidth,
        documentElementScrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        overflowPx: Math.max(
          0,
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
        offenders,
      };
    });
    results.push({ width, ...metrics });
  }
  return results;
}

async function main() {
  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const mobile = await browser.newContext({
    ...devices["iPhone 13"],
    viewport: { width: 390, height: 844 },
  });
  const homePage = await mobile.newPage();
  const homeShifts = await collectShifts(homePage, "/", { width: 390, height: 844 });
  await writeFile(join(OUT, "home-layout-shifts.json"), JSON.stringify(homeShifts, null, 2));

  const funcPage = await mobile.newPage();
  const funcShifts = await collectShifts(funcPage, "/programs/functional-training", {
    width: 390,
    height: 844,
  });
  await writeFile(join(OUT, "functional-layout-shifts.json"), JSON.stringify(funcShifts, null, 2));

  const timelinePage = await mobile.newPage();
  await captureTimeline(timelinePage, "/", "home");
  await captureTimeline(timelinePage, "/programs/functional-training", "functional");
  await composeContactSheet(browser);

  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const overflowPage = await desk.newPage();
  const overflow = await overflowAudit(overflowPage);
  await writeFile(
    join(OUT, "HORIZONTAL-OVERFLOW.json"),
    JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl: BASE, results: overflow }, null, 2),
  );

  await browser.close();
  console.log(
    JSON.stringify(
      {
        homeCls: homeShifts.totalCls,
        homeTop: homeShifts.shifts.slice(0, 5).map((s) => ({
          value: s.value,
          startTime: s.startTime,
          sources: s.sources.map((x) => x.identity?.selector),
        })),
        functionalCls: funcShifts.totalCls,
        overflow: overflow.map((r) => ({
          width: r.width,
          overflowPx: r.overflowPx,
          topOffender: r.offenders[0]?.selector,
        })),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
