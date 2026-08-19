/**
 * Before/after comparison sheets for illustrative-ai production.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const BEFORE = join(process.cwd(), "docs/revamp/screenshots/final-owner-visual-stage-2-correction");
const OUT = join(process.cwd(), "docs/revamp/screenshots");

const ROUTES = [
  { path: "/", slug: "home" },
  { path: "/programs/functional-training", slug: "functional" },
  { path: "/programs/yoga", slug: "yoga" },
  { path: "/about", slug: "about" },
  { path: "/locations", slug: "locations" },
];

const PROGRAMMES = [
  "/programs/functional-training",
  "/programs/home-personal-training",
  "/programs/online-training",
  "/programs/zumba",
  "/programs/yoga",
  "/programs/adult-dance",
  "/programs/wedding-choreography",
  "/programs/corporate-wellness",
];

async function stitchComparison(page, pairs, outFile, width) {
  const html = `<!DOCTYPE html><html><head><style>
    body{margin:0;background:#111;font-family:system-ui,sans-serif}
    .row{display:flex;gap:8px;padding:8px}
    .cell{flex:1}
    img{width:100%;display:block}
    p{color:#ccc;font-size:12px;margin:4px 0 8px;text-transform:uppercase;letter-spacing:.08em}
  </style></head><body>${pairs
    .map(
      (p) => `<div class="row"><div class="cell"><p>Before · ${p.label}</p><img src="file:///${p.before.replace(/\\/g, "/")}"/></div><div class="cell"><p>After · ${p.label}</p><img src="file:///${p.after.replace(/\\/g, "/")}"/></div></div>`,
    )
    .join("")}</body></html>`;
  await page.setContent(html, { waitUntil: "load" });
  await page.setViewportSize({ width, height: 1200 });
  await page.screenshot({ path: outFile, fullPage: true });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const w of [390, 1440]) {
    const pairs = ROUTES.map((r) => ({
      label: r.slug,
      before: join(BEFORE, `full-${w}`, `${r.slug === "home" ? "home" : r.path.replace(/^\//, "").replace(/\//g, "-")}.png`),
      after: join(process.cwd(), "docs/revamp/screenshots/final-production-ai-media", `full-${w}`, `${r.slug === "home" ? "home" : r.path.replace(/^\//, "").replace(/\//g, "-")}.png`),
    }));
    await stitchComparison(
      page,
      pairs,
      join(OUT, `final-production-ai-media-comparison-${w}.png`),
      w * 2 + 40,
    );
  }

  // Programme family strip at 1440 — capture live viewports
  const progHtmlRows = [];
  for (const path of PROGRAMMES) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    const shot = join(OUT, `_tmp-${slug(path)}.png`);
    await page.screenshot({ path: shot, fullPage: false });
    progHtmlRows.push({ path, shot });
  }

  const familyHtml = `<!DOCTYPE html><html><head><style>
    body{margin:0;background:#111;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:8px}
    img{width:100%;display:block}
    p{color:#ccc;font-size:11px;margin:0 0 4px}
  </style></head><body>${progHtmlRows
    .map(
      (r) => `<div><p>${r.path}</p><img src="file:///${r.shot.replace(/\\/g, "/")}"/></div>`,
    )
    .join("")}</body></html>`;
  await page.setContent(familyHtml);
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.screenshot({ path: join(OUT, "programme-family-ai-production-comparison.png"), fullPage: true });

  await browser.close();
  await writeFile(join(OUT, "comparison-manifest.json"), JSON.stringify({ createdAt: new Date().toISOString() }, null, 2));
}

function slug(path) {
  return path.replace(/^\//, "").replace(/\//g, "-") || "home";
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
