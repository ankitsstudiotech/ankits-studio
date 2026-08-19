import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("docs/revamp/screenshots/stage-8-final-production");
const files = [
  "programme-family-ft.png",
  "programme-family-yoga.png",
  "programme-family-zumba.png",
  "programme-family-dance.png",
  "programme-family-wedding.png",
  "programme-family-home.png",
  "programme-family-online.png",
];
const labels = ["Functional", "Yoga", "Zumba", "Dance", "Wedding", "Home PT", "Online"];

const imgs = files
  .map((f, i) => {
    const src = path.join(dir, f).replace(/\\/g, "/");
    return `<figure><img src="file:///${src}"/><figcaption>${labels[i]}</figcaption></figure>`;
  })
  .join("");

const html = `<!doctype html><html><head><style>
body{margin:0;background:#0a0a0a;color:#fff;font-family:system-ui}
h1{font-size:18px;padding:16px 20px;margin:0;letter-spacing:.04em}
.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;padding:0 12px 16px}
figure{margin:0}
img{width:100%;height:220px;object-fit:cover;object-position:top;display:block;border:1px solid #222}
figcaption{font-size:11px;padding:6px 2px;opacity:.8}
</style></head><body>
<h1>PROGRAMME FAMILY — FINAL COMPARISON (synthetic=false)</h1>
<div class="grid">${imgs}</div>
</body></html>`;

const htmlPath = path.join(dir, "_family-collage.html");
fs.writeFileSync(htmlPath, html);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 340 } });
await page.goto("file:///" + htmlPath.replace(/\\/g, "/"));
await page.screenshot({ path: path.join(dir, "programme-family-final-comparison.png") });
await browser.close();
console.log("wrote programme-family-final-comparison.png");
