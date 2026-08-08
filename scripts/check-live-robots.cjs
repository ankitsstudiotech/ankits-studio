const { chromium } = require("@playwright/test");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const route of [
    "/blog",
    "/trainers",
    "/transformations",
    "/programs/personal-training",
    "/",
    "/privacy-policy",
  ]) {
    await p.goto("https://ankits-studio.vercel.app" + route, {
      waitUntil: "domcontentloaded",
    });
    const robots = await p
      .locator('meta[name="robots"]')
      .evaluateAll((els) =>
        els.map((e) => e.getAttribute("content")),
      );
    console.log(route, robots);
  }
  await b.close();
})();
