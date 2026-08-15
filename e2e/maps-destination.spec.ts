import { expect, test } from "@playwright/test";

const OWNER_PLACE = {
  "75pmKFuezsCSd5JP8": "https://www.google.com/maps?cid=1449651828904908702",
  "1J1KpmeYWsoWkckr6": "https://www.google.com/maps?cid=13110130416387656174",
  PVDTDZKsM9iSHdjD9: "https://www.google.com/maps?cid=15462103123995988415",
  "6tQTXnrur5iggfJ6A": "https://www.google.com/maps?cid=15257919123141756320",
};

const SURFACES = [
  "/",
  "/locations",
  "/locations/airoli-sector-19",
  "/locations/airoli-sector-8",
  "/locations/ghansoli",
  "/locations/thane",
  "/contact",
];

test.describe("Maps destination semantics", () => {
  for (const route of SURFACES) {
    test(`${route} Maps hrefs are place listings, not directions`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const hrefs = await page.$$eval('a[href*="maps"], a[href*="goo.gl"]', (anchors) =>
        anchors.map((a) => ({
          href: a.getAttribute("href") || "",
          target: a.getAttribute("target"),
          rel: a.getAttribute("rel"),
          text: (a.textContent || "").trim(),
        })),
      );
      const maps = hrefs.filter((a) => /maps|goo\.gl/i.test(a.href));
      expect(maps.length, `${route} should expose Maps links`).toBeGreaterThan(0);
      for (const link of maps) {
        expect(link.href, link.text).not.toMatch(/\/maps\/dir\//);
        expect(link.href).not.toMatch(/[?&](destination|origin|travelmode|dir_action)=/);
        expect(link.target).toBe("_blank");
        expect(link.rel || "").toMatch(/noopener/);
        expect(link.rel || "").toMatch(/noreferrer/);
        expect(link.text).not.toMatch(/^Directions$/i);
        if (/cid=/.test(link.href)) {
          expect(Object.values(OWNER_PLACE)).toContain(link.href);
        }
      }
    });
  }
});
