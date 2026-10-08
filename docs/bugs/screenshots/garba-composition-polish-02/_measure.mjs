import { chromium } from "playwright";
import { writeFileSync } from "fs";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });
await page.goto("http://127.0.0.1:3456/", { waitUntil: "domcontentloaded" });
await page
  .getByRole("button", { name: /accept/i })
  .first()
  .click({ timeout: 2000 })
  .catch(() => {});
await page.locator('[data-campaign="garba-night-2026"]').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

const metrics = await page.evaluate(() => {
  const billboard = document.querySelector('[data-campaign="garba-night-2026"]');
  const edition = [...billboard.querySelectorAll("p")].find((p) =>
    /5th edition/i.test(p.textContent || ""),
  );
  const date = [...billboard.querySelectorAll("p")].find((p) =>
    /^17\s*oct$/i.test((p.textContent || "").trim()),
  );
  const poster = billboard.querySelector("img");
  const er = edition.getBoundingClientRect();
  const dr = date.getBoundingClientRect();
  const pr = poster.getBoundingClientRect();
  return {
    editionBottom: er.bottom,
    dateTop: dr.top,
    gapPx: Math.round(dr.top - er.bottom),
    posterHeight: Math.round(pr.height),
    billboardHeight: Math.round(billboard.getBoundingClientRect().height),
  };
});

await page.goto("http://127.0.0.1:3456/events/garba-night-2026", {
  waitUntil: "domcontentloaded",
});
await page
  .getByRole("button", { name: /accept/i })
  .first()
  .click({ timeout: 2000 })
  .catch(() => {});

const teaser = await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    /play 2026 teaser/i.test(b.textContent || ""),
  );
  const img = document.querySelector("[data-playing]")?.querySelector("img");
  if (!btn || !img) return { error: "missing" };
  const br = btn.getBoundingClientRect();
  const ir = img.getBoundingClientRect();
  return {
    btnTop: br.top,
    imgBottom: ir.bottom,
    overlaps: br.top < ir.bottom - 1,
    gapBelowPoster: Math.round(br.top - ir.bottom),
  };
});

const venue = await page.evaluate(() => {
  const section = document.querySelector("#garba-venue-title")?.closest("section");
  const dest = section?.querySelector('[aria-hidden="true"]');
  const sr = section.getBoundingClientRect();
  const dr = dest.getBoundingClientRect();
  return {
    sectionWidth: Math.round(sr.width),
    destLeft: Math.round(dr.left - sr.left),
    destWidth: Math.round(dr.width),
    destOccupancy: `${Math.round((dr.width / sr.width) * 100)}%`,
  };
});

const out = { metrics, teaser, venue };
writeFileSync(
  "docs/bugs/screenshots/garba-composition-polish-02/measure.json",
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify(out, null, 2));
await browser.close();
