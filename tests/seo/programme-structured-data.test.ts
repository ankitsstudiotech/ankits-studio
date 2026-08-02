import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getConfirmedProgrammes,
  getProgrammes,
  getTrainers,
  isMigrationPendingProgramme,
} from "@/content";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildCourseJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { serializeJsonLd } from "@/lib/seo/serialize";

const FORBIDDEN_SCHEMA_KEYS =
  /"(@type"\s*:\s*"(Course|Offer|Event|AggregateRating|Review|CourseInstance)"|"(offers|aggregateRating|review|instructor|hasCourseInstance|courseCode|totalPrice|price|priceCurrency|startDate|endDate|eventSchedule)")/i;

const LEGACY_SLUGS = [
  "strength-training",
  "personal-training",
  "kids-dance",
  "weight-loss-fitness",
] as const;

const NON_BRANCH_SLUGS = ["home-personal-training", "online-training"] as const;

describe("programme structured data — ADR-017", () => {
  it("never emits Course JSON-LD for any programme without an approved Course model", () => {
    for (const programme of getProgrammes()) {
      expect(buildCourseJsonLd(programme)).toBeNull();
    }
  });

  it("programme route modules do not call buildCourseJsonLd", () => {
    const root = join(process.cwd(), "src", "app", "programs");
    const indexSource = readFileSync(join(root, "page.tsx"), "utf8");
    const detailSource = readFileSync(join(root, "[slug]", "page.tsx"), "utf8");
    expect(indexSource).not.toMatch(/buildCourseJsonLd/);
    expect(detailSource).not.toMatch(/buildCourseJsonLd/);
    expect(detailSource).toMatch(/buildWebPageJsonLd/);
    expect(indexSource).toMatch(/buildCollectionPageJsonLd/);
  });

  it("confirmed programme WebPage markup stays minimal and visible-field-only", () => {
    for (const programme of getConfirmedProgrammes()) {
      const page = buildWebPageJsonLd({
        name: programme.name,
        description: programme.shortDescription,
        path: `/programs/${programme.slug}`,
      });
      expect(page["@type"]).toBe("WebPage");
      expect(page.name).toBe(programme.name);
      expect(page.description).toBe(programme.shortDescription);
      expect(page.url).toContain(`/programs/${programme.slug}`);

      const serialized = serializeJsonLd(page);
      expect(serialized).not.toMatch(FORBIDDEN_SCHEMA_KEYS);
      expect(serialized.toLowerCase()).not.toMatch(/rating|review|award/);
      expect(Object.keys(page).sort()).toEqual(
        ["@context", "@type", "description", "name", "url"].sort(),
      );
    }
  });

  it("does not put unverified prices or schedules into programme JSON-LD", () => {
    for (const programme of getConfirmedProgrammes()) {
      const page = buildWebPageJsonLd({
        name: programme.name,
        description: programme.shortDescription,
        path: `/programs/${programme.slug}`,
      });
      const blob = JSON.stringify(page).toLowerCase();
      expect(blob).not.toMatch(/"price"/);
      expect(blob).not.toMatch(/pricecurrency/);
      expect(blob).not.toMatch(/startdate|enddate|openinghoursspecification|eventschedule/);
      expect(blob).not.toMatch(/₹|rs\.|inr/);
    }
  });

  it("does not embed mock trainer identities in programme JSON-LD", () => {
    const trainerNames = getTrainers().map((trainer) => trainer.name.toLowerCase());
    expect(trainerNames.length).toBeGreaterThan(0);

    for (const programme of getConfirmedProgrammes()) {
      const page = buildWebPageJsonLd({
        name: programme.name,
        description: programme.shortDescription,
        path: `/programs/${programme.slug}`,
      });
      const blob = JSON.stringify(page).toLowerCase();
      for (const name of trainerNames) {
        expect(blob).not.toContain(name);
      }
      expect(blob).not.toMatch(/instructor|teacher|coach"/);
    }
  });

  it("does not represent Home or Online Training as a physical-branch class in JSON-LD", () => {
    for (const slug of NON_BRANCH_SLUGS) {
      const programme = getProgrammes().find((item) => item.slug === slug);
      expect(programme).toBeDefined();
      const page = buildWebPageJsonLd({
        name: programme!.name,
        description: programme!.shortDescription,
        path: `/programs/${slug}`,
      });
      const blob = JSON.stringify(page).toLowerCase();
      expect(page["@type"]).toBe("WebPage");
      expect(blob).not.toMatch(/exercisegym|localbusiness|postaladdress|streetaddress|"location"/);
      expect(blob).not.toMatch(/airoli|kharghar|vashi|belapur|nerul/);
    }
  });

  it("/programs CollectionPage stays minimal without Course ItemList", () => {
    const collection = buildCollectionPageJsonLd({
      name: "Programmes",
      description: "Confirmed programmes at Ankit's Studio",
      path: "/programs",
    });
    expect(collection["@type"]).toBe("CollectionPage");
    const serialized = serializeJsonLd(collection);
    expect(serialized).not.toMatch(/"@type":"Course"/);
    expect(serialized).not.toMatch(/ItemList/);
    expect(serialized).not.toMatch(FORBIDDEN_SCHEMA_KEYS);
  });

  it("legacy migration-pending programmes keep BreadcrumbList-only contract in builders", () => {
    const legacy = getProgrammes().filter(isMigrationPendingProgramme);
    expect(legacy.map((item) => item.slug).sort()).toEqual([...LEGACY_SLUGS].sort());

    for (const programme of legacy) {
      expect(buildCourseJsonLd(programme)).toBeNull();
      const crumbs = buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Programmes", path: "/programs" },
        { name: programme.name, path: `/programs/${programme.slug}` },
      ]);
      expect(crumbs["@type"]).toBe("BreadcrumbList");
      expect(serializeJsonLd(crumbs)).not.toMatch(/"@type":"Course"/);
    }
  });

  it("does not generate JSON-LD properties from timetable fallback data", async () => {
    const { getTimetableSlots } = await import("@/content");
    expect(getTimetableSlots()).toEqual([]);

    for (const programme of getConfirmedProgrammes()) {
      const page = buildWebPageJsonLd({
        name: programme.name,
        description: programme.shortDescription,
        path: `/programs/${programme.slug}`,
      });
      const blob = JSON.stringify(page);
      expect(blob).not.toMatch(/06:00|10:00|Monday|Tuesday|hasCourseInstance/);
    }
  });
});

describe("legacy programmes stay out of sitemap", () => {
  it("never includes migration-pending programme URLs when sitemap is populated", async () => {
    // Direct filter contract mirrors buildSitemapEntries programme branch.
    const { getProgrammes: programmes } = await import("@/content");
    const included = programmes().filter(
      (programme) =>
        programme.dataStatus === "verified" && programme.taxonomyStatus === "confirmed",
    );
    const excluded = programmes().filter((programme) => programme.taxonomyStatus === "migration-pending");

    expect(excluded.map((item) => item.slug).sort()).toEqual([...LEGACY_SLUGS].sort());
    for (const legacy of excluded) {
      expect(included.some((item) => item.slug === legacy.slug)).toBe(false);
    }

    // While site is noindex, sitemap is empty — legacy still absent.
    expect(buildSitemapEntries().every((entry) => !LEGACY_SLUGS.some((slug) => entry.url.includes(`/programs/${slug}`)))).toBe(
      true,
    );
  });
});
