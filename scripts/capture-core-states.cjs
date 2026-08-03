const { chromium } = require("@playwright/test");
const path = require("path");

const out = path.join("docs/revamp/screenshots/core-routes-system-propagation");
const base = "http://localhost:3000";

(async () => {
  const b = await chromium.launch();

  const h = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await h.goto(base + "/", { waitUntil: "networkidle" });
  await h.waitForTimeout(500);
  await h.screenshot({
    path: path.join(out, "after-1440-home-regression.png"),
    fullPage: true,
  });
  await h.close();

  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + "/programs", { waitUntil: "networkidle" });
  const rows = p.locator("#programmes-index a[href^='/programs/']");
  if ((await rows.count()) > 0) {
    await rows.first().hover();
    await p.screenshot({ path: path.join(out, "state-1440-programs-hover.png") });
    await rows.first().focus();
    await p.screenshot({ path: path.join(out, "state-1440-programs-focus.png") });
  }
  await p.close();

  const rm = await b.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await rm.goto(base + "/programs", { waitUntil: "networkidle" });
  await rm.screenshot({
    path: path.join(out, "state-1440-programs-reduced-motion.png"),
  });
  await rm.close();

  const l = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await l.goto(base + "/locations", { waitUntil: "networkidle" });
  const br = l.locator("a[href^='/locations/']").first();
  if ((await br.count()) > 0) {
    await br.hover();
    await l.screenshot({ path: path.join(out, "state-1440-locations-hover.png") });
  }
  await l.close();

  const r = await b.newPage();
  await r.goto(base + "/book-a-free-trial", { waitUntil: "domcontentloaded" });
  console.log("redirect", r.url());
  await r.close();

  for (const url of [
    "/programs",
    "/programs/home-personal-training",
    "/locations",
    "/about",
    "/timetable",
    "/pricing",
    "/trial",
    "/contact",
    "/",
  ]) {
    const pg = await b.newPage();
    await pg.goto(base + url, { waitUntil: "domcontentloaded" });
    const t = await pg.locator("body").innerText();
    const bad = [];
    if (/branch-floor/i.test(t)) bad.push("branch-floor");
    if (/owner-confirmed/i.test(t)) bad.push("owner-confirmed");
    if (/open neighbourhood studio/i.test(t)) bad.push("neighbourhood studio");
    if (/we do not publish class-by-class/i.test(t)) bad.push("class-by-class");
    if (/Mock preview/i.test(t)) bad.push("mock");
    console.log(url, bad.length ? "FAIL " + bad.join(",") : "ok");
    await pg.close();
  }

  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
