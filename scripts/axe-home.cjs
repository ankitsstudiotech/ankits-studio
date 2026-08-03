const { chromium } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  for (const v of bad) {
    console.log("\n===", v.id, v.impact, v.description);
    for (const n of v.nodes.slice(0, 8)) {
      console.log("-", n.target.join(" "), (n.failureSummary || "").slice(0, 280));
    }
  }
  console.log("\nTotal serious/critical:", bad.length);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
