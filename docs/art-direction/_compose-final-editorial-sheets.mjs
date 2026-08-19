/**
 * Compose required before/after contact sheets for the final editorial pass.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const ROOT = join(process.cwd(), "docs/art-direction/screenshots/final-editorial-pass");

async function toDataUrl(phase, file) {
  const buf = await readFile(join(ROOT, phase, file));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function sheet(name, title, cells, columns = 2) {
  const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
  const page = await browser.newPage({ viewport: { width: 1800, height: 1100 } });
  const html = `<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box}
    body{margin:0;background:#0b0b0c;color:#e8e4dc;font-family:system-ui,sans-serif;padding:20px}
    h1{font-size:15px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 14px;font-weight:650}
    .grid{display:grid;grid-template-columns:repeat(${columns},minmax(0,1fr));gap:12px}
    .card{border:1px solid #2a2a2e;background:#111;padding:8px}
    .label{font-size:11px;margin:0 0 6px;color:#b8b4aa;letter-spacing:.06em;text-transform:uppercase}
    img{width:100%;height:260px;object-fit:contain;object-position:top center;background:#0b0b0c;display:block}
  </style></head><body>
  <h1>${title}</h1>
  <div class="grid">
  ${cells
    .map(
      (cell) =>
        `<div class="card"><p class="label">${cell.label}</p><img alt="${cell.label}" src="${cell.src}" /></div>`,
    )
    .join("")}
  </div>
  </body></html>`;
  await page.setContent(html, { waitUntil: "load" });
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  await page.screenshot({ path: join(ROOT, name), fullPage: true, scale: "css" });
  await browser.close();
  console.log("wrote", name);
}

async function pair(label, file) {
  return [
    { label: `${label} · before`, src: await toDataUrl("before", file) },
    { label: `${label} · after`, src: await toDataUrl("after", file) },
  ];
}

const home = [
  ...(await pair("Hero 1536", "home-hero-1536.png")),
  ...(await pair("Hero 1920", "home-hero-1920.png")),
  ...(await pair("Programmes 1536", "home-programmes-1536.png")),
  ...(await pair("Founder 1536", "home-founder-1536.png")),
];
await sheet("01-home-before-after.png", "Home — hero / programmes / founder", home, 4);

const programmes = [
  ...(await pair("Index 1536", "programs-1536.png")),
  ...(await pair("Index 1920", "programs-1920.png")),
  ...(await pair("Index 390", "programs-390.png")),
];
await sheet("02-programmes-before-after.png", "Programmes index", programmes, 2);

const details = [
  ...(await pair("Functional 1536", "functional-1536.png")),
  ...(await pair("Yoga 1536", "yoga-1536.png")),
  ...(await pair("Corporate 1536", "corporate-1536.png")),
];
await sheet("03-programme-details-before-after.png", "Programme details", details, 2);

const locations = [
  ...(await pair("Index 1536", "locations-1536.png")),
  ...(await pair("Index 1920", "locations-1920.png")),
  ...(await pair("Airoli 19 1536", "airoli-19-1536.png")),
];
await sheet("04-locations-before-after.png", "Locations + Airoli 19", locations, 2);

const about = [
  ...(await pair("About 1536", "about-1536.png")),
  ...(await pair("About 390", "about-390.png")),
];
await sheet("05-about-before-after.png", "About", about, 2);

const reviews = [
  ...(await pair("Reviews 1536", "home-reviews-1536.png")),
  ...(await pair("Reviews 1920", "home-reviews-1920.png")),
  ...(await pair("Reviews 390", "home-reviews-390.png")),
];
await sheet("06-reviews-before-after.png", "Google Reviews", reviews, 2);

const close = [
  ...(await pair("CTA 1536", "home-close-1536.png")),
  ...(await pair("Footer 1536", "home-footer-1536.png")),
  ...(await pair("CTA 1920", "home-close-1920.png")),
];
await sheet("07-closing-footer-before-after.png", "Closing CTA + footer", close, 2);

const mobile = [
  ...(await pair("Home hero 390", "home-hero-390.png")),
  ...(await pair("Programmes 390", "home-programmes-390.png")),
  ...(await pair("Locations 390", "home-locations-390.png")),
  ...(await pair("Reviews 390", "home-reviews-390.png")),
];
await sheet("08-mobile-before-after.png", "Mobile 390", mobile, 4);

const family = [
  ...(await pair("Home 1536", "home-hero-1536.png")),
  ...(await pair("Programs 1536", "programs-1536.png")),
  ...(await pair("Locations 1536", "locations-1536.png")),
  ...(await pair("About 1536", "about-1536.png")),
  ...(await pair("Pricing 1536", "pricing-1536.png")),
  ...(await pair("Trial 1536", "trial-1536.png")),
];
await sheet("09-final-route-family-contact-sheet.png", "Route family contact sheet", family, 4);
