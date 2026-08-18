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
    const mode = await page.locator("#google-reviews").getAttribute("data-google-proof-mode");
    expect(body).toMatch(/Reviews on Google/i);
    expect(body).not.toMatch(/reviews failed|quota exceeded|Place ID missing/i);
    expect(body).not.toMatch(/Transformations/i);
    expect(body).not.toMatch(/John Doe|mock review/i);
    if (mode === "live-google-reviews") {
      expect(body).toMatch(/What members are saying/i);
      expect(body).toMatch(/Shown in Google relevance order/);
      expect(body).toMatch(/up to 2 per studio/);
      expect(body).toMatch(/Google Maps/i);
      expect(body).not.toMatch(/Reviews supplied by Google Maps/i);
      expect(body).not.toMatch(/aren[’']t verified by Google/i);
      expect(body).not.toMatch(/checks for and removes fake content/i);
      const reviewLinks = page.locator("#google-reviews").getByRole("link", { name: /View review on Google Maps/i });
      expect(await reviewLinks.count()).toBeGreaterThan(0);
      expect(await reviewLinks.count()).toBeLessThanOrEqual(8);
    } else {
      expect(body).toMatch(/Explore Google feedback/i);
      expect(body).not.toMatch(/What members are saying/i);
    }
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

  test("live review rail hides the scrollbar, keeps inset, and advances with Next", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 730 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const chapter = page.locator("#google-reviews");
    await expect(chapter).toBeVisible();
    if ((await chapter.getAttribute("data-google-proof-mode")) !== "live-google-reviews") {
      return;
    }

    const rail = chapter.getByRole("list", { name: /Google reviews/i });
    await expect(rail).toBeVisible();
    const metrics = await rail.evaluate((el) => {
      const style = getComputedStyle(el);
      const items = [...el.querySelectorAll(":scope > li")];
      const paddings = items.slice(0, 2).map((item) => {
        const cs = getComputedStyle(item);
        return {
          padStart: Number.parseFloat(cs.paddingInlineStart),
          padEnd: Number.parseFloat(cs.paddingInlineEnd),
          borderStart: Number.parseFloat(cs.borderInlineStartWidth),
        };
      });
      return {
        overflowX: style.overflowX,
        scrollbarWidth: style.scrollbarWidth,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        paddings,
      };
    });
    expect(metrics.overflowX).toBe("auto");
    expect(metrics.scrollbarWidth).toBe("none");
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
    expect(metrics.paddings[0]?.padStart).toBeGreaterThanOrEqual(20);
    expect(metrics.paddings[0]?.padEnd).toBeGreaterThanOrEqual(20);
    if (metrics.paddings[1]) {
      expect(metrics.paddings[1].padStart).toBeGreaterThanOrEqual(20);
      expect(metrics.paddings[1].borderStart).toBeGreaterThan(0);
    }

    const prev = chapter.getByRole("button", { name: /Previous reviews/i });
    const next = chapter.getByRole("button", { name: /Next reviews/i });
    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();
    const before = await rail.evaluate((el) => el.scrollLeft);
    await next.click();
    await expect.poll(async () => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
    await expect(prev).toBeEnabled();
  });
});
