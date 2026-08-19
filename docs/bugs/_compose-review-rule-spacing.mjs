import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const ROOT = join(process.cwd(), "docs/bugs/screenshots/review-rule-spacing");

async function toDataUrl(file) {
  const buf = await readFile(join(ROOT, file));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

const pairs = [
  { file: "review-before-after-390.png", label: "390", before: "before-review-390.png", after: "after-review-390.png" },
  { file: "review-before-after-1536.png", label: "1536", before: "before-review-1536.png", after: "after-review-1536.png" },
  { file: "review-before-after-1920.png", label: "1920", before: "before-review-1920.png", after: "after-review-1920.png" },
];

const browser = await chromium.launch({ headless: true });

for (const pair of pairs) {
  const before = await toDataUrl(pair.before);
  const after = await toDataUrl(pair.after);
  const page = await browser.newPage({ viewport: { width: 1800, height: 1100 } });
  await page.setContent(`<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box}
    body{margin:0;background:#0b0b0c;font-family:system-ui,sans-serif;color:#e8e4dc;padding:20px}
    h1{font-size:16px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 14px}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .card{border:1px solid #2a2a2e;padding:8px;background:#111}
    .label{font-size:11px;font-weight:600;margin:0 0 6px}
    img{width:100%;height:auto;display:block;background:#1a1a1e}
  </style></head><body>
  <h1>Reviews rail — ${pair.label} before / after</h1>
  <div class="row">
    <div class="card"><p class="label">BEFORE</p><img alt="before" src="${before}" /></div>
    <div class="card"><p class="label">AFTER</p><img alt="after" src="${after}" /></div>
  </div>
  </body></html>`);
  await page.screenshot({ path: join(ROOT, pair.file), fullPage: true });
  await page.close();
}

const auditPage = await browser.newPage({ viewport: { width: 1800, height: 1400 } });
const after1536 = await toDataUrl("after-review-1536.png");
const after390 = await toDataUrl("after-review-390.png");
const after1920 = await toDataUrl("after-review-1920.png");
const after768 = await toDataUrl("after-review-768.png");
await auditPage.setContent(`<!DOCTYPE html><html><head><style>
  *{box-sizing:border-box}
  body{margin:0;background:#0b0b0c;font-family:system-ui,sans-serif;color:#e8e4dc;padding:20px}
  h1{font-size:16px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 8px}
  p{font-size:12px;color:#b8b4ac;margin:0 0 14px;max-width:90ch;line-height:1.45}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .card{border:1px solid #2a2a2e;padding:8px;background:#111}
  .label{font-size:11px;font-weight:600;margin:0 0 6px}
  img{width:100%;height:220px;object-fit:cover;object-position:top left;display:block}
</style></head><body>
<h1>Vertical-rule inset — after sweep</h1>
<p>Reviews: 24px cell inset, separator between items, scrollbar hidden. Locations directory: 24px after first column at ≥1200. Other vertical rules classified A/C/D — no global padding patch.</p>
<div class="grid">
  <div class="card"><p class="label">Reviews 390</p><img alt="390" src="${after390}" /></div>
  <div class="card"><p class="label">Reviews 768</p><img alt="768" src="${after768}" /></div>
  <div class="card"><p class="label">Reviews 1536</p><img alt="1536" src="${after1536}" /></div>
  <div class="card"><p class="label">Reviews 1920</p><img alt="1920" src="${after1920}" /></div>
</div>
</body></html>`);
await auditPage.screenshot({
  path: join(ROOT, "vertical-rule-sitewide-audit.png"),
  fullPage: true,
});
await browser.close();
console.log("composed");
