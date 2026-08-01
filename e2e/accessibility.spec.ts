import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Routes covered here, beyond `/` and 404 — see docs/DECISIONS.md ADR-013
 * (A11Y-001). Picks one route per interaction pattern rather than every
 * route: `/trial` and `/contact` are the two form pages, `/timetable` is the
 * no-JS GET-filter page, `/programs/yoga` and `/locations/airoli` are the two
 * dynamic detail-page templates.
 */
const ROUTES = ["/", "/trial", "/contact", "/timetable", "/programs/yoga", "/locations/airoli"];

for (const route of ROUTES) {
  test(`${route} has no critical or serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrCritical = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical"
    );
    expect(seriousOrCritical).toEqual([]);
  });
}

test("404 page has no critical or serious accessibility violations", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");
  const results = await new AxeBuilder({ page }).analyze();
  const seriousOrCritical = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical"
  );
  expect(seriousOrCritical).toEqual([]);
});
