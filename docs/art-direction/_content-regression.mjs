/**
 * Content regression gate — visible production text vs local after.
 * Flags substantive wording changes. Numeric indices (01–08) are allowed.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const beforeOrigin = process.env.BEFORE_ORIGIN || "https://ankits-studio.vercel.app";
const afterOrigin = process.env.AFTER_ORIGIN || "http://localhost:3000";

const routes = [
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/programs/yoga",
  "/programs/zumba",
  "/programs/adult-dance",
  "/programs/wedding-choreography",
  "/programs/home-personal-training",
  "/programs/online-training",
  "/programs/corporate-wellness",
  "/locations",
  "/locations/airoli-sector-19",
  "/pricing",
  "/trial",
  "/contact",
  "/privacy-policy",
  "/terms",
];

const BANNED = [
  "Movement Culture",
  "Kickboxing",
  "Yoga & Mindfulness",
  "Zumba & Dance",
  "Online Coaching",
  "Initiate Protocol",
  "Claim Free Trial",
  "CLAIM FREE TRIAL",
  "METRO",
];

function extract(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\b0[1-8]\b/g, "")
    .trim();
}

const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const page = await browser.newPage({ reducedMotion: "reduce" });
page.setDefaultTimeout(60_000);

const report = { bannedLeaks: [], diffs: [], formattingOnly: [] };

for (const route of routes) {
  await page.goto(`${beforeOrigin}${route}`, { waitUntil: "domcontentloaded" });
  const before = extract(await page.locator("main").innerText());
  await page.goto(`${afterOrigin}${route}`, { waitUntil: "domcontentloaded" });
  const after = extract(await page.locator("main").innerText());

  for (const phrase of BANNED) {
    if (after.includes(phrase) && !before.includes(phrase)) {
      report.bannedLeaks.push({ route, phrase });
    }
  }

  if (before === after) continue;

  const beforeWords = new Set(before.split(" ").filter(Boolean));
  const afterWords = new Set(after.split(" ").filter(Boolean));
  const added = [...afterWords].filter((w) => !beforeWords.has(w)).slice(0, 40);
  const removed = [...beforeWords].filter((w) => !afterWords.has(w)).slice(0, 40);
  const entry = { route, added, removed };
  const onlyIndex = [...added, ...removed].every((w) => /^\d+$/.test(w) || w === "/" || w === "Train" || w === "Move");
  if (onlyIndex) report.formattingOnly.push(entry);
  else report.diffs.push(entry);
}

const out = join(process.cwd(), "docs/art-direction/CONTENT-REGRESSION.json");
writeFileSync(out, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ banned: report.bannedLeaks.length, diffs: report.diffs.length, formatting: report.formattingOnly.length, out }, null, 2));
await browser.close();
