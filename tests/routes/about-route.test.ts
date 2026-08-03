import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getStudioAbout,
  getStudioCommercial,
  getConfirmedProgrammes,
  getPubliclyListedBranches,
} from "@/content";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { WHATSAPP_TRIAL_TEMPLATE, getPrimaryConversionLabel } from "@/lib/conversion";
import { generateMetadata } from "@/app/(marketing)/about/page";

const FORBIDDEN_SD =
  /"(@type"\s*:\s*"(Person|Employee|Award|Review|AggregateRating|EducationalOccupationalCredential)"|"founder")/i;

const FORBIDDEN_COPY =
  /transform your life|unlock your potential|where passion meets|award-winning|trusted by thousands|highly qualified|government-certified|expert trainers|certified professionals|2\+\s*years|Ministry of Ayush|government certified|government approved/i;

describe("about route — verified studio story only", () => {
  it("publishes outcome-safe founder story and founding year; keeps credentials pending", () => {
    const about = getStudioAbout();
    expect(about.founderStoryStatus).toBe("verified");
    expect(about.foundingDateStatus).toBe("verified");
    expect(about.credentialsStatus).toBe("pending");
    expect(about.founderStory).toMatch(/Ankit Nalawade founded Ankit’s Studio in 2019/);
    expect(about.founderStory).not.toMatch(/transform their life|all health problems|Ministry of Ayush/i);
    expect(about.foundingDateLabel).toBe("2019");
    expect(about.credentialsSummary).toBeUndefined();
    expect(about.trainerProfileSlugs).toEqual([]);
  });

  it("does not publish ambiguous 2+ years experience marketing", () => {
    const commercial = getStudioCommercial();
    expect(commercial.experienceNotePartial).toMatch(/2\+/);
    const page = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "about", "page.tsx"),
      "utf8",
    );
    const aboutSource = readFileSync(
      join(process.cwd(), "src", "content", "mock", "studio-about.ts"),
      "utf8",
    );
    expect(page).not.toMatch(/experienceNotePartial|2\+\s*years/i);
    expect(aboutSource).not.toMatch(/2\+\s*years/i);
  });

  it("shows owner-provided 15+ trainers without certification adjectives", () => {
    const about = getStudioAbout();
    expect(about.teamBody).toMatch(/15\+/);
    expect(about.teamCountProvenance).toMatch(/Owner-provided/i);
    expect(about.teamBody).not.toMatch(FORBIDDEN_COPY);
    expect(about.teamCountProvenance).not.toMatch(
      /highly qualified|certified|elite|expert|government/i,
    );
  });

  it("page source shows founder when verified and omits unsupported credibility claims", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "about", "page.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(/FounderStoryPlaceholder|ScrollReveal/);
    expect(source).not.toMatch(FORBIDDEN_COPY);
    expect(source).not.toMatch(/mission|vision|value cards|timeline/i);
    expect(source).toMatch(/founderStoryStatus === "verified"/);
    expect(source).toMatch(/Founded/);
    expect(source).toMatch(/getPrimaryConversionHref/);
    expect(source).toMatch(/buildWebPageJsonLd/);
    expect(source).toMatch(/15\+/);
    expect(source).toMatch(/machine-free/i);
  });

  it("lists confirmed programmes and four publicly listed branches", () => {
    expect(getConfirmedProgrammes().length).toBeGreaterThanOrEqual(7);
    expect(getPubliclyListedBranches().map((b) => b.locality)).toEqual(
      expect.arrayContaining([
        "Airoli Sector 19",
        "Airoli Sector 8",
        "Ghansoli",
        "Thane",
      ]),
    );
    expect(getPubliclyListedBranches()).toHaveLength(4);
  });

  it("WhatsApp trial CTA label and template remain honest", () => {
    expect(getPrimaryConversionLabel()).toBe("Book a Free Trial on WhatsApp");
    expect(WHATSAPP_TRIAL_TEMPLATE).toMatch(/free trial/i);
    expect(WHATSAPP_TRIAL_TEMPLATE).toMatch(/Preferred branch:/);
    expect(WHATSAPP_TRIAL_TEMPLATE).toMatch(/Trial date:/);
    expect(WHATSAPP_TRIAL_TEMPLATE).not.toMatch(/submitted|delivered/i);
  });

  it("metadata uses About title direction without invented claims", () => {
    const metadata = generateMetadata();
    expect(String(metadata.title)).toMatch(/About/i);
    expect(String(metadata.description)).toMatch(/2019|machine-free|coach-led|branches/i);
    expect(String(metadata.description)).not.toMatch(FORBIDDEN_COPY);
  });

  it("emits WebPage + BreadcrumbList only — no Person/founder/credential markup", () => {
    const about = getStudioAbout();
    const page = buildWebPageJsonLd({
      name: about.seoTitle,
      description: about.seoDescription,
      path: "/about",
    });
    const crumbs = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]);
    expect(page["@type"]).toBe("WebPage");
    expect(serializeJsonLd(page)).not.toMatch(FORBIDDEN_SD);
    expect(serializeJsonLd(crumbs)).not.toMatch(FORBIDDEN_SD);
  });
});
