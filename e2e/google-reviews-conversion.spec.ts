import { expect, test } from "@playwright/test";

const CONSUMER = [
  "/programs/functional-training",
  "/programs/zumba",
  "/programs/yoga",
  "/programs/adult-dance",
  "/programs/wedding-choreography",
  "/programs/home-personal-training",
  "/programs/online-training",
] as const;

async function revealProgrammeSticky(page: import("@playwright/test").Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("[data-sticky-cta-eligible]").waitFor({ state: "attached" });
  await page.evaluate(() => {
    const hero = document.getElementById("programme-hero-cta");
    const y = hero
      ? hero.getBoundingClientRect().bottom + window.scrollY + Math.round(window.innerHeight * 0.35)
      : 1200;
    window.scrollTo(0, y);
  });
  await page.waitForSelector('[data-sticky-cta-reveal="true"]', { timeout: 10_000 });
}

test.describe("programme sticky conversion intent", () => {
  for (const route of CONSUMER) {
    test(`${route} keeps trial sticky semantics`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await revealProgrammeSticky(page);
      const sticky = page.locator("[data-sticky-cta-intent='free-trial']");
      await expect(sticky).toHaveCount(1);
      await expect(sticky).toContainText(/Free trial/i);
      await expect(sticky.locator("a")).toContainText(/WhatsApp trial/i);
    });
  }

  test("Corporate Wellness sticky uses enquiry semantics", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/programs/corporate-wellness", { waitUntil: "domcontentloaded" });
    await revealProgrammeSticky(page);
    const sticky = page.locator("[data-sticky-cta-intent='service-enquiry']");
    await expect(sticky).toHaveCount(1);
    await expect(sticky).toContainText(/For teams/i);
    await expect(sticky.locator("a")).toContainText(/Enquire on WhatsApp/i);
    await expect(sticky).not.toContainText(/trial/i);
    const href = await sticky.locator("a").getAttribute("href");
    expect(href).toMatch(/wa\.me/);
    expect(decodeURIComponent(href ?? "")).toMatch(/Corporate Wellness for our organisation/i);
    expect(decodeURIComponent(href ?? "")).not.toMatch(/free trial/i);
  });

  test("sticky labels do not overflow at 360, 390, and 430", async ({ page }) => {
    for (const width of [360, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/programs/corporate-wellness", { waitUntil: "domcontentloaded" });
      await revealProgrammeSticky(page);
      const overflow = await page.locator("[data-sticky-cta-eligible]").evaluate((el) => {
        return el.scrollWidth > el.clientWidth + 1;
      });
      expect(overflow, `overflow at ${width}`).toBe(false);
    }
  });
});

test.describe("homepage Google social proof", () => {
  test("reviews chapter sits after branches and is not an error state", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#google-reviews")).toBeVisible();
    const order = await page.evaluate(() => {
      const locations = document.getElementById("locations");
      const reviews = document.getElementById("google-reviews");
      const founder = document.getElementById("founder");
      if (!locations || !reviews || !founder) return null;
      return {
        branchesBeforeReviews: Boolean(
          locations.compareDocumentPosition(reviews) & Node.DOCUMENT_POSITION_FOLLOWING,
        ),
        reviewsBeforeFounder: Boolean(
          reviews.compareDocumentPosition(founder) & Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      };
    });
    expect(order).toEqual({ branchesBeforeReviews: true, reviewsBeforeFounder: true });
    const body = await page.locator("#google-reviews").innerText();
    expect(body).toMatch(/What members say/i);
    expect(body).not.toMatch(/reviews failed|quota exceeded|Place ID missing/i);
    expect(body).not.toMatch(/Transformations/i);
  });

  test("homepage images complete without broken src", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    const broken = await page.evaluate(() =>
      [...document.images].filter((img) => img.naturalWidth === 0 && img.src).map((img) => img.src),
    );
    expect(broken).toEqual([]);
  });

  test("header CTA remains the site-wide trial label", async ({ page }) => {
    await page.goto("/programs/corporate-wellness", { waitUntil: "domcontentloaded" });
    await expect(page.locator("header")).toContainText(/Book a free trial on WhatsApp/i);
  });
});
