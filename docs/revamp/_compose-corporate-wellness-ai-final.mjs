/**
 * Compose Corporate Wellness before/after and eight-programme family final sheet.
 * Uses data URLs — never file:/// image references.
 *
 * Usage: node docs/revamp/_compose-corporate-wellness-ai-final.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const SHOTS = join(process.cwd(), "docs/revamp/screenshots");
const FAMILY_ROOT = join(SHOTS, "final-production-ai-media", "full-1440");
const BEFORE = join(SHOTS, "corporate-wellness-ai-before");
const AFTER = join(SHOTS, "corporate-wellness-ai-final");

const PROGRAMME_FAMILY = [
  { cluster: "TRAIN", label: "Functional", file: "programs-functional-training.png" },
  { cluster: "TRAIN", label: "Home PT", file: "programs-home-personal-training.png" },
  { cluster: "TRAIN", label: "Online", file: "programs-online-training.png" },
  { cluster: "MOVE", label: "Zumba", file: "programs-zumba.png" },
  { cluster: "MOVE", label: "Yoga", file: "programs-yoga.png" },
  { cluster: "MOVE", label: "Dance", file: "programs-adult-dance.png" },
  { cluster: "CELEBRATE", label: "Wedding", file: "programs-wedding-choreography.png" },
  { cluster: "FOR TEAMS", label: "Corporate Wellness", file: "programs-corporate-wellness.png" },
];

async function toDataUrl(absPath) {
  const buf = await readFile(absPath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

function pngDimensions(buffer) {
  if (buffer.length < 24) return null;
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function validateComparisonPng(page, absPath, minBytes) {
  const buf = await readFile(absPath);
  const dims = pngDimensions(buf);
  if (!dims || buf.length < minBytes) {
    throw new Error(`Comparison PNG invalid or too small: ${absPath} (${buf.length} bytes)`);
  }
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  await page.setContent(`<img id="probe" src="${dataUrl}" />`);
  const natural = await page.evaluate(() => {
    const img = document.getElementById("probe");
    return { w: img.naturalWidth, h: img.naturalHeight, complete: img.complete };
  });
  if (!natural.complete || natural.w <= 0) throw new Error(`Undecodable comparison PNG: ${absPath}`);
  return { width: natural.w, height: natural.h, bytes: buf.length };
}

async function waitForRealPixels(page) {
  await page.waitForFunction(() =>
    [...document.images].every((img) => img.complete && img.naturalWidth > 0),
  );
  const empty = await page.evaluate(() =>
    [...document.images].filter((img) => img.naturalWidth === 0).map((img) => img.alt),
  );
  if (empty.length) throw new Error(`Empty image cells: ${empty.join(", ")}`);
}

async function composeFamily(browser) {
  const cells = [];
  for (const prog of PROGRAMME_FAMILY) {
    cells.push({ ...prog, src: await toDataUrl(join(FAMILY_ROOT, prog.file)) });
  }
  const page = await browser.newPage();
  const html = `<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box}
    body{margin:0;background:#0b0b0c;font-family:system-ui,sans-serif;color:#e8e4dc;padding:12px}
    .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
    .card{border:1px solid #2a2a2e;padding:8px;background:#111}
    .cluster{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#9a9590;margin:0 0 4px}
    .label{font-size:12px;font-weight:600;margin:0 0 6px;color:#f2efe8}
    img{width:100%;height:420px;object-fit:cover;object-position:top;display:block;background:#1a1a1e}
  </style></head><body><div class="grid">
  ${cells
    .map(
      (c) => `<article class="card"><p class="cluster">${c.cluster}</p><p class="label">${c.label}</p><img src="${c.src}" alt="${c.label}"/></article>`,
    )
    .join("")}
  </div></body></html>`;
  await page.setViewportSize({ width: 1440, height: 980 });
  await page.setContent(html, { waitUntil: "load" });
  await waitForRealPixels(page);
  const outPath = join(SHOTS, "programme-family-ai-production-comparison-final.png");
  await page.screenshot({ path: outPath, fullPage: true });
  const meta = await validateComparisonPng(page, outPath, 180_000);
  await page.close();
  return { outPath, ...meta };
}

async function composeBeforeAfter(browser) {
  const pairs = [
    { label: "390", before: await toDataUrl(join(BEFORE, "full-390.png")), after: await toDataUrl(join(AFTER, "full-390.png")) },
    { label: "1440", before: await toDataUrl(join(BEFORE, "full-1440.png")), after: await toDataUrl(join(AFTER, "full-1440.png")) },
  ];
  const page = await browser.newPage();
  const html = `<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box}
    body{margin:0;background:#0b0b0c;font-family:system-ui,sans-serif;color:#e8e4dc}
    h1{font-size:16px;margin:16px 16px 8px;letter-spacing:.08em;text-transform:uppercase;color:#9a9590}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 16px;border-bottom:1px solid #2a2a2e}
    .cell img{width:100%;height:auto;display:block;background:#111}
    .meta{font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 6px;color:#9a9590}
    .route{font-size:13px;font-weight:600;margin:0 0 8px;color:#f2efe8}
  </style></head><body>
  <h1>Corporate Wellness — text-led fallback vs illustrative AI hero</h1>
  ${pairs
    .map(
      (p) => `<section class="row"><div class="cell"><p class="route">${p.label}</p><p class="meta">Before · text-led fallback</p><img src="${p.before}" alt="before ${p.label}"/></div><div class="cell"><p class="route">&nbsp;</p><p class="meta">After · illustrative AI</p><img src="${p.after}" alt="after ${p.label}"/></div></section>`,
    )
    .join("")}
  </body></html>`;
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.setContent(html, { waitUntil: "load" });
  await waitForRealPixels(page);
  const outPath = join(SHOTS, "corporate-wellness-ai-before-after.png");
  await page.screenshot({ path: outPath, fullPage: true });
  const meta = await validateComparisonPng(page, outPath, 80_000);
  await page.close();
  return { outPath, ...meta };
}

async function main() {
  const browser = await chromium.launch();
  const family = await composeFamily(browser);
  const beforeAfter = await composeBeforeAfter(browser);
  await browser.close();
  const report = { createdAt: new Date().toISOString(), family, beforeAfter };
  await writeFile(join(AFTER, "composition-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
