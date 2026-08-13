/**
 * Compose final release-candidate contact sheets from captured PNGs.
 * Uses data URLs — never file:/// image references.
 *
 * Usage: node docs/revamp/_compose-final-release-contact-sheets-2026-08-13.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const ROOT = join(process.cwd(), "docs/revamp/screenshots/final-release-candidate-2026-08-13");

async function toDataUrl(file) {
  const buf = await readFile(join(ROOT, file));
  return { src: `data:image/png;base64,${buf.toString("base64")}`, bytes: buf.length };
}

function pngDimensions(buffer) {
  if (buffer.length < 24) return null;
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
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

async function compose(browser, filename, title, cells, columns, cropHeight) {
  const resolved = [];
  for (const cell of cells) {
    resolved.push({ ...cell, ...(await toDataUrl(cell.file)) });
  }
  const page = await browser.newPage({
    viewport: { width: Math.max(1600, columns * 420), height: 1200 },
  });
  const html = `<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box}
    body{margin:0;background:#0b0b0c;font-family:system-ui,sans-serif;color:#e8e4dc;padding:16px}
    h1{font-size:18px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 14px}
    .grid{display:grid;grid-template-columns:repeat(${columns},1fr);gap:10px}
    .card{border:1px solid #2a2a2e;padding:8px;background:#111}
    .label{font-size:11px;font-weight:600;margin:0 0 6px;color:#f2efe8}
    img{width:100%;height:${cropHeight}px;object-fit:cover;object-position:top;display:block;background:#1a1a1e}
  </style></head><body>
  <h1>${title}</h1>
  <div class="grid">
  ${resolved
    .map(
      (cell) =>
        `<div class="card"><p class="label">${cell.label}</p><img alt="${cell.label}" src="${cell.src}" /></div>`,
    )
    .join("")}
  </div></body></html>`;
  await page.setContent(html, { waitUntil: "load" });
  await waitForRealPixels(page);
  const out = join(ROOT, filename);
  await page.screenshot({ path: out, fullPage: true });
  const buf = await readFile(out);
  const dims = pngDimensions(buf);
  if (!dims || buf.length < 20_000) {
    throw new Error(`Contact sheet too small: ${filename} (${buf.length} bytes)`);
  }
  await page.close();
  console.log("wrote", filename, dims, buf.length);
}

const browser = await chromium.launch({ headless: true });

await compose(
  browser,
  "final-mobile-contact-sheet.png",
  "Final mobile 390 — public routes",
  [
    { label: "Home", file: "full-390-home.png" },
    { label: "About", file: "full-390-about.png" },
    { label: "Programmes", file: "full-390-programs.png" },
    { label: "Functional", file: "full-390-programs--functional-training.png" },
    { label: "Corporate", file: "full-390-programs--corporate-wellness.png" },
    { label: "Locations", file: "full-390-locations.png" },
    { label: "Pricing", file: "full-390-pricing.png" },
    { label: "Trial", file: "full-390-trial.png" },
  ],
  4,
  520,
);

await compose(
  browser,
  "final-tablet-contact-sheet.png",
  "Final tablet 768 — primary public set",
  [
    { label: "Home", file: "full-768-home.png" },
    { label: "About", file: "full-768-about.png" },
    { label: "Programmes", file: "full-768-programs.png" },
    { label: "Functional", file: "full-768-programs--functional-training.png" },
    { label: "Yoga", file: "full-768-programs--yoga.png" },
    { label: "Dance", file: "full-768-programs--adult-dance.png" },
    { label: "Corporate", file: "full-768-programs--corporate-wellness.png" },
    { label: "Locations", file: "full-768-locations.png" },
    { label: "Pricing", file: "full-768-pricing.png" },
    { label: "Trial", file: "full-768-trial.png" },
    { label: "Contact", file: "full-768-contact.png" },
    { label: "Airoli 19", file: "full-768-locations--airoli-sector-19.png" },
  ],
  4,
  480,
);

await compose(
  browser,
  "final-desktop-contact-sheet.png",
  "Final desktop 1440 — primary public set",
  [
    { label: "Home", file: "full-1440-home.png" },
    { label: "About", file: "full-1440-about.png" },
    { label: "Programmes", file: "full-1440-programs.png" },
    { label: "Functional", file: "full-1440-programs--functional-training.png" },
    { label: "Corporate", file: "full-1440-programs--corporate-wellness.png" },
    { label: "Locations", file: "full-1440-locations.png" },
    { label: "Pricing", file: "full-1440-pricing.png" },
    { label: "Trial", file: "full-1440-trial.png" },
  ],
  4,
  420,
);

await compose(
  browser,
  "final-programme-family-contact-sheet.png",
  "Final programme family 1440",
  [
    { label: "A Structured — Functional", file: "full-1440-programs--functional-training.png" },
    { label: "B Fluid — Zumba", file: "full-1440-programs--zumba.png" },
    { label: "B Fluid — Dance", file: "full-1440-programs--adult-dance.png" },
    { label: "C Calm — Yoga", file: "full-1440-programs--yoga.png" },
    { label: "D Service — Wedding", file: "full-1440-programs--wedding-choreography.png" },
    { label: "D Service — Home PT", file: "full-1440-programs--home-personal-training.png" },
    { label: "D Service — Online", file: "full-1440-programs--online-training.png" },
    { label: "D Service — Corporate", file: "full-1440-programs--corporate-wellness.png" },
  ],
  4,
  460,
);

await browser.close();
console.log("contact sheets ready");
