import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getPublishableTrainers,
  getStudioTrainersPage,
  getTrainers,
  shouldIndexTrainersRoute,
  TRAINERS_ROUTE_INDEX_THRESHOLD,
} from "@/content";
import {
  WHATSAPP_TRAINER_AVAILABILITY_TEMPLATE,
  buildWhatsAppTrainerAvailabilityUrl,
} from "@/lib/conversion";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { generateMetadata } from "@/app/(marketing)/trainers/page";

const FORBIDDEN_SD =
  /"(@type"\s*:\s*"(Person|Employee|Award|Review|AggregateRating|EducationalOccupationalCredential)"|"founder")/i;

const FORBIDDEN_COPY =
  /highly qualified|government[- ]approved|expert trainers|certified professionals|2\+\s*years|meet our experts|elite coaching|industry-leading|decades of experience/i;

describe("trainers route — honest team presentation", () => {
  it("publishes zero trainer profiles while none are publishable", () => {
    expect(getPublishableTrainers()).toEqual([]);
    expect(getTrainers()).toEqual([]);
    expect(shouldIndexTrainersRoute()).toBe(false);
    expect(TRAINERS_ROUTE_INDEX_THRESHOLD).toBe(3);
  });

  it("team size is owner-provided 15+ coaches without credential adjectives", () => {
    const page = getStudioTrainersPage();
    expect(page.teamSizeLabel).toBe("15+");
    expect(page.teamSizeProvenance).toBe("owner_provided");
    expect(page.teamSizeBody).toMatch(/15\+ coaches/);
    expect(page.lede).toMatch(/15\+ coaches/);
    expect(page.teamSizeBody).not.toMatch(FORBIDDEN_COPY);
    expect(page.lede).not.toMatch(FORBIDDEN_COPY);
    expect(page.readinessBody).not.toMatch(FORBIDDEN_COPY);
    expect(page.readinessBody).not.toMatch(/verified|publication gate|evidence|data status/i);
    expect(page.programmesBody).not.toMatch(/verified/i);
    expect(page.branchesBody).not.toMatch(/verified/i);
  });

  it("page source omits fake cards, credential claims, media plates, and provenance UI", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "trainers", "page.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(FORBIDDEN_COPY);
    expect(source).not.toMatch(/getTrainers\(|Illustrative Trainer|Card href=\{`\/trainers/);
    expect(source).not.toMatch(/PulseMediaPlate|teamSizeProvenanceNote|Owner-provided|readinessBodyMockPreview/);
    expect(source).toMatch(/getPublishableTrainers/);
    expect(source).toMatch(/forceNoIndex:\s*!shouldIndexTrainersRoute/);
    expect(source).toMatch(/buildWebPageJsonLd/);
    expect(source).toMatch(/buildWhatsAppTrainerAvailabilityUrl/);
    expect(source).toMatch(/15\+|teamSizeLabel/);
    expect(source).toMatch(/RouteOpening|SectionReveal/);
  });

  it("slug route only resolves publishable trainers", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "trainers", "[slug]", "page.tsx"),
      "utf8",
    );
    expect(source).toMatch(/getPublishableTrainerBySlug/);
    expect(source).toMatch(/getPublishableTrainers/);
    expect(source).not.toMatch(/getTrainers\(\)/);
  });

  it("metadata forces noindex while below the publication threshold", () => {
    const metadata = generateMetadata();
    expect(String(metadata.title)).toMatch(/Training Team|Trainers/i);
    expect(String(metadata.description)).toMatch(/coaching team|availability/i);
    expect(String(metadata.description)).not.toMatch(FORBIDDEN_COPY);
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("WhatsApp availability template does not promise a named trainer", () => {
    expect(WHATSAPP_TRAINER_AVAILABILITY_TEMPLATE).toMatch(/training availability/i);
    expect(WHATSAPP_TRAINER_AVAILABILITY_TEMPLATE).not.toMatch(/named trainer|gender|qualification/i);
    const href = buildWhatsAppTrainerAvailabilityUrl();
    expect(href).toMatch(/^https:\/\/wa\.me\//);
    expect(href).toContain(encodeURIComponent("I would like to enquire about training availability."));
  });

  it("emits WebPage + BreadcrumbList only — no Person/Employee/Credential", () => {
    const pageContent = getStudioTrainersPage();
    const page = buildWebPageJsonLd({
      name: pageContent.seoTitle,
      description: pageContent.seoDescription,
      path: "/trainers",
    });
    const crumbs = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Trainers", path: "/trainers" },
    ]);
    expect(page["@type"]).toBe("WebPage");
    expect(serializeJsonLd(page)).not.toMatch(FORBIDDEN_SD);
    expect(serializeJsonLd(crumbs)).not.toMatch(FORBIDDEN_SD);
  });
});
