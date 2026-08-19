/**
 * Compose before/after and programme-family comparison sheets using embedded data URLs.
 * Avoids file:// restrictions that broke the original generator on Windows/Chromium.
 *
 * Usage: node docs/revamp/_compose-ai-media-comparisons-fixed.mjs
 */
import { readFile, mkdir, writeFile, copyFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { execSync } from "node:child_process";

const BEFORE_ROOT = join(process.cwd(), "docs/revamp/screenshots/final-owner-visual-stage-2-correction");
const BEFORE_FALLBACK = join(process.cwd(), "docs/revamp/screenshots/final-owner-visual-stage-2");
const AFTER_ROOT = join(process.cwd(), "docs/revamp/screenshots/final-production-ai-media");
const OUT_DIR = join(process.cwd(), "docs/revamp/screenshots/final-production-ai-media-correction");
const OUT_SCREENSHOTS = join(process.cwd(), "docs/revamp/screenshots");

const ROUTES = [
  { label: "Home", file: "home.png" },
  { label: "Functional Training", file: "programs-functional-training.png" },
  { label: "Yoga", file: "programs-yoga.png" },
  { label: "About", file: "about.png" },
  { label: "Locations", file: "locations.png" },
];

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

async function fileExists(absPath) {
  try {
    await readFile(absPath);
    return true;
  } catch {
    return false;
  }
}

async function resolveBeforePath(width, file) {
  const primary = join(BEFORE_ROOT, `full-${width}`, file);
  if (await fileExists(primary)) return { abs: primary, source: "stage-2-correction" };
  const fallback = join(BEFORE_FALLBACK, `full-${width}`, file);
  if (await fileExists(fallback)) return { abs: fallback, source: "stage-2-fallback" };
  throw new Error(`Missing before shot for ${file} at ${width}px`);
}

function pngDimensions(buffer) {
  if (buffer.length < 24) return null;
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function validateComparisonPng(absPath, minBytes = 120_000) {
  const buf = await readFile(absPath);
  const dims = pngDimensions(buf);
  if (!dims || buf.length < minBytes) {
    throw new Error(`Comparison PNG invalid or too small: ${absPath} (${buf.length} bytes)`);
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  await page.setContent(`<img id="probe" src="${dataUrl}" />`);
  const natural = await page.evaluate(() => {
    const img = document.getElementById("probe");
    return { w: img.naturalWidth, h: img.naturalHeight, complete: img.complete };
  });
  await browser.close();
  if (!natural.complete || natural.w <= 0) throw new Error(`Undecodable comparison PNG: ${absPath}`);
  return { width: natural.w, height: natural.h, bytes: buf.length };
}

async function composeBeforeAfter(width) {
  const pairs = [];
  const beforeSources = [];
  for (const route of ROUTES) {
    const beforeResolved = await resolveBeforePath(width, route.file);
    const after = join(AFTER_ROOT, `full-${width}`, route.file);
    if (!(await fileExists(after))) throw new Error(`Missing after: ${after}`);
    beforeSources.push({ route: route.label, source: beforeResolved.source });
    pairs.push({
      label: route.label,
      before: await toDataUrl(beforeResolved.abs),
      after: await toDataUrl(after),
    });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const html = `<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box}
    body{margin:0;background:#0b0b0c;font-family:system-ui,sans-serif;color:#e8e4dc}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px;border-bottom:1px solid #2a2a2e}
    .cell img{width:100%;height:auto;display:block;background:#111}
    .meta{font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 6px;color:#9a9590}
    .route{font-size:13px;font-weight:600;margin:0 0 10px;color:#f2efe8}
  </style></head><body>
  ${pairs
    .map(
      (p) => `<section class="row"><div class="cell"><p class="route">${p.label}</p><p class="meta">Before · text-led</p><img src="${p.before}" alt="before ${p.label}"/></div><div class="cell"><p class="route">&nbsp;</p><p class="meta">After · illustrative AI</p><img src="${p.after}" alt="after ${p.label}"/></div></section>`,
    )
    .join("")}
  </body></html>`;
  await page.setViewportSize({ width: width * 2 + 48, height: 900 });
  await page.setContent(html, { waitUntil: "load" });
  await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
  const outPath = join(OUT_SCREENSHOTS, `final-production-ai-media-comparison-${width}-fixed.png`);
  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();
  const meta = await validateComparisonPng(outPath);
  return { ...meta, beforeSources };
}

async function composeProgrammeFamily() {
  const cells = [];
  for (const prog of PROGRAMME_FAMILY) {
    const after = join(AFTER_ROOT, "full-1440", prog.file);
    if (!(await fileExists(after))) throw new Error(`Missing programme shot: ${after}`);
    cells.push({ ...prog, src: await toDataUrl(after) });
  }

  const browser = await chromium.launch();
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
  await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
  const outPath = join(OUT_SCREENSHOTS, "programme-family-ai-production-comparison-fixed.png");
  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();
  return validateComparisonPng(outPath, 180_000);
}

async function copyRepresentativeShots() {
  await mkdir(OUT_DIR, { recursive: true });
  const picks = [
    ["full-390/home.png", "home-390.png"],
    ["full-1440/home.png", "home-1440.png"],
    ["full-390/programs-functional-training.png", "functional-390.png"],
    ["full-1440/programs-functional-training.png", "functional-1440.png"],
    ["full-390/programs-yoga.png", "yoga-390.png"],
    ["full-1440/programs-yoga.png", "yoga-1440.png"],
    ["full-390/programs-corporate-wellness.png", "corporate-wellness-390.png"],
    ["full-1440/programs-corporate-wellness.png", "corporate-wellness-1440.png"],
    ["full-390/about.png", "about-390.png"],
    ["full-1440/about.png", "about-1440.png"],
    ["full-390/locations.png", "locations-390.png"],
    ["full-1440/locations.png", "locations-1440.png"],
  ];
  for (const [src, dest] of picks) {
    await copyFile(join(AFTER_ROOT, src), join(OUT_DIR, dest));
  }
  for (const w of [390, 1440]) {
    await copyFile(
      join(OUT_SCREENSHOTS, `final-production-ai-media-comparison-${w}-fixed.png`),
      join(OUT_DIR, `comparison-${w}-fixed.png`),
    );
  }
  await copyFile(
    join(OUT_SCREENSHOTS, "programme-family-ai-production-comparison-fixed.png"),
    join(OUT_DIR, "programme-family-comparison-fixed.png"),
  );
}

async function createEvidenceZip() {
  const zipPath = join(OUT_DIR, "..", "final-production-ai-media-correction.zip");
  const files = await readdir(OUT_DIR);
  const list = files.filter((f) => f.endsWith(".png") || f.endsWith(".json"));
  if (process.platform === "win32") {
    const psFiles = list.map((f) => `'${join(OUT_DIR, f).replace(/'/g, "''")}'`).join(",");
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path ${psFiles} -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force"`,
      { stdio: "inherit" },
    );
  } else {
    execSync(`cd "${OUT_DIR}" && zip -r "${zipPath}" ${list.map((f) => `"${f}"`).join(" ")}`, {
      stdio: "inherit",
    });
  }
  return { zipPath, fileCount: list.length, files: list };
}

async function main() {
  const rootCause = {
    issue: "Chromium page.setContent could not load file:/// Windows paths; before filenames also mismatched (functional.png vs programs-functional-training.png)",
    fix: "Embed PNGs as data URLs and wait for img.complete before screenshot",
  };
  const r390 = await composeBeforeAfter(390);
  const r1440 = await composeBeforeAfter(1440);
  const rFamily = await composeProgrammeFamily();
  await copyRepresentativeShots();
  const zip = await createEvidenceZip();
  await writeFile(
    join(OUT_DIR, "composition-report.json"),
    JSON.stringify({ rootCause, r390, r1440, rFamily, zip, createdAt: new Date().toISOString() }, null, 2),
  );
  console.log("Composed comparisons OK", { r390, r1440, rFamily, zip });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
