import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const origin = process.env.ORIGIN || "https://ankits-studio.vercel.app";
const phase = process.env.PHASE || "before";
const out = join(process.cwd(), "docs/bugs/screenshots/review-rule-spacing");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const page = await browser.newPage({ reducedMotion: "reduce" });
page.setDefaultTimeout(60_000);

async function shotSection(name, selector, width, height, path) {
  await page.setViewportSize({ width, height });
  await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await loc.screenshot({
    path: join(out, name),
    animations: "disabled",
  });
}

async function measureReviews() {
  return page.evaluate(() => {
    const rail = document.querySelector('#google-reviews [aria-label="Google reviews"]');
    if (!rail) return null;
    const style = getComputedStyle(rail);
    const items = [...rail.querySelectorAll(":scope > li")];
    return {
      overflowX: style.overflowX,
      scrollbarWidth: style.scrollbarWidth,
      scrollWidth: rail.scrollWidth,
      clientWidth: rail.clientWidth,
      items: items.map((item, i) => {
        const cs = getComputedStyle(item);
        return {
          i,
          padStart: Number.parseFloat(cs.paddingInlineStart),
          padEnd: Number.parseFloat(cs.paddingInlineEnd),
          borderStart: Number.parseFloat(cs.borderInlineStartWidth),
          borderEnd: Number.parseFloat(cs.borderInlineEndWidth),
        };
      }),
      disclosure: document.querySelector("[data-review-disclosure]")?.textContent ?? null,
      bodySnippet: (document.querySelector("#google-reviews")?.innerText ?? "").slice(0, 500),
    };
  });
}

function verticalRuleProbe() {
  return page.evaluate(() => {
    const hits = [];
    const els = [...document.querySelectorAll("body *")];
    for (const el of els) {
      const cs = getComputedStyle(el);
      const left = Number.parseFloat(cs.borderLeftWidth);
      const right = Number.parseFloat(cs.borderRightWidth);
      if (left < 0.5 && right < 0.5) continue;
      if (cs.display === "none" || el.getClientRects().length === 0) continue;
      const tag = `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""}`;
      hits.push({
        tag: tag.slice(0, 120),
        left,
        right,
        padL: Number.parseFloat(cs.paddingLeft),
        padR: Number.parseFloat(cs.paddingRight),
        w: Math.round(el.getBoundingClientRect().width),
      });
    }
    return hits
      .filter((h) => (h.left >= 0.5 && h.padL < 16) || (h.right >= 0.5 && h.padR < 16))
      .slice(0, 80);
  });
}

const reviewViewports = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1536", width: 1536, height: 730 },
  { name: "1920", width: 1920, height: 1080 },
];

const reviewMetrics = {};
for (const vp of reviewViewports) {
  await shotSection(`${phase}-review-${vp.name}.png`, "#google-reviews", vp.width, vp.height, "/");
  reviewMetrics[vp.name] = await measureReviews();
  console.log(phase, "reviews", vp.name, JSON.stringify(reviewMetrics[vp.name], null, 0));
}

if (phase === "before" || phase === "after") {
  const auditRoutes = [
    { route: "/", sel: "#google-reviews", name: "home-reviews" },
    { route: "/", sel: "#services", name: "home-programmes" },
    { route: "/", sel: "#locations", name: "home-locations" },
    { route: "/programs", sel: "main", name: "programs" },
    { route: "/locations", sel: "main", name: "locations" },
    { route: "/about", sel: "main", name: "about" },
    { route: "/programs/functional-training", sel: "main", name: "programme-detail" },
    { route: "/pricing", sel: "main", name: "pricing" },
    { route: "/timetable", sel: "main", name: "timetable" },
  ];
  const tight = {};
  await page.setViewportSize({ width: 1536, height: 730 });
  for (const row of auditRoutes) {
    await page.goto(`${origin}${row.route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(250);
    tight[row.name] = await verticalRuleProbe();
    console.log("tight", row.name, tight[row.name].length);
  }
  const { writeFileSync } = await import("node:fs");
  writeFileSync(join(out, `${phase}-metrics.json`), JSON.stringify({ origin, reviewMetrics, tight }, null, 2));
}

console.log("done", { origin, phase, out });
await browser.close();
