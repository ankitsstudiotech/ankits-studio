import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getBranchMapsUrl,
  getConfirmedProgrammes,
  getProgrammeBySlug,
  getPubliclyListedBranches,
  getStudioAbout,
  getStudioCommercial,
  getStudioContactLinks,
  getStudioMemberStoriesPage,
  getStudioTrainersPage,
  shouldIndexMemberStoriesRoute,
  shouldIndexTrainersRoute,
} from "@/content";
import { getPrimaryConversionHref } from "@/lib/conversion";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";

const root = (...parts: string[]) => join(process.cwd(), ...parts);
const read = (...parts: string[]) => readFileSync(root(...parts), "utf8");

const FORBIDDEN_PUBLIC =
  /\b(owner[- ]confirmed|evidence[- ]pending|publication threshold|AI concept preview|data status|provenance|mock preview|synthetic)\b/i;

const FORBIDDEN_SD =
  /"(@type"\s*:\s*"(Review|AggregateRating|Offer)")/;

describe("Stage 6 — verified business and local trust", () => {
  it("homepage prioritises programmes and branches without duplicate trust rail", () => {
    const home = read("src", "app", "(marketing)", "page.tsx");
    expect(home).toMatch(/ProgrammeShowcase/);
    expect(home).toMatch(/BranchExplorer/);
    expect(home).toMatch(/FounderHomeMoment/);
    expect(home).not.toMatch(/PulseTrustRail|WhyStudio/);
    const branch = read("src", "components", "home", "BranchExplorer.tsx");
    expect(branch).toMatch(/paperBand/);
  });

  it("About keeps founder primary and honest team wording", () => {
    const about = getStudioAbout();
    expect(about.foundingDateLabel).toBe("2019");
    expect(about.founderStory).toMatch(/Ankit Nalawade founded Ankit’s Studio in Airoli Sector 19 in 2019/);
    expect(about.founderStory).not.toMatch(/Ministry of Ayush|all health problems|certification/i);
    expect(about.teamBody).toMatch(/15\+ coaches across our programmes and studios/);
    expect(about.teamBody).not.toMatch(/certified experts|highly qualified|government/i);
    const page = read("src", "app", "(marketing)", "about", "page.tsx");
    expect(page).toMatch(/Ankit Nalawade · Founder/);
    expect(page).toMatch(/communityMedia/);
  });

  it("exposes Maps URLs for all four publicly listed branches", () => {
    const branches = getPubliclyListedBranches();
    expect(branches).toHaveLength(4);
    for (const branch of branches) {
      const url = getBranchMapsUrl(branch);
      expect(url, branch.slug).toMatch(/^https:\/\/www\.google\.com\/maps\?cid=\d+$/);
      expect(url).not.toMatch(/\/maps\/dir\/|destination=/);
      expect(url).not.toMatch(/localhost/);
    }
  });

  it("branch detail and locations expose Open in Google Maps with safe attributes", () => {
    const detail = read("src", "components", "locations", "pulse", "BranchDetailView.tsx");
    expect(detail).toMatch(/Open in Google Maps/);
    expect(detail).toMatch(/target="_blank"/);
    expect(detail).toMatch(/rel="noopener noreferrer"/);
    expect(detail).toMatch(/detailAddress/);
    const row = read("src", "components", "locations", "BranchRow.tsx");
    expect(row).toMatch(/Open in Google Maps/);
    expect(row).toMatch(/noopener noreferrer/);
    const discovery = read("src", "components", "locations", "pulse", "LocationDiscovery.tsx");
    expect(discovery).toMatch(/Open in Google Maps/);
    const contact = read("src", "app", "(marketing)", "contact", "page.tsx");
    expect(contact).toMatch(/getBranchMapsUrl/);
    expect(contact).toMatch(/Open in Google Maps/);
    expect(contact).toMatch(/Messages are answered during studio operating hours/);
    expect(contact).not.toMatch(/within one minute|verified enquiry/i);
  });

  it("exposes phone, mailto and WhatsApp trial hrefs", () => {
    const links = getStudioContactLinks();
    expect(links.phoneHref).toMatch(/^tel:\+?91/);
    expect(links.emailHref).toMatch(/^mailto:ankitsstudio5@gmail\.com$/i);
    const trial = getPrimaryConversionHref();
    expect(trial.startsWith("https://wa.me/") || trial === "/trial").toBe(true);
  });
});

describe("Stage 6 — conversion and proof ambiguity fixes", () => {
  it("trial and pricing make free trial and post-join ₹300 unmistakable", () => {
    const commercial = getStudioCommercial();
    expect(commercial.trialIsFree).toBe(true);
    expect(commercial.registrationFeeInr).toBe(300);
    const trial = read("src", "app", "(marketing)", "trial", "page.tsx");
    expect(trial).toMatch(/The trial class is free/);
    expect(trial).toMatch(/no registration fee to try/);
    expect(trial).toMatch(/After you join/);
    expect(trial).toMatch(/not charged for the trial/);
    const pricing = read("src", "app", "(marketing)", "pricing", "page.tsx");
    expect(pricing).toMatch(/What applies today/);
    expect(pricing).toMatch(/Not a monthly fee and not a trial charge/);
    expect(pricing).not.toMatch(/Confirmed facts|pricing unavailable|sorry/i);
  });

  it("Home PT / Online / Wedding keep accurate delivery semantics", () => {
    const home = getProgrammeBySlug("home-personal-training");
    const online = getProgrammeBySlug("online-training");
    const wedding = getProgrammeBySlug("wedding-choreography");
    expect(home?.deliveryMode).toBe("home");
    expect(home?.longDescription).toMatch(/location|home|session/i);
    expect(online?.deliveryMode).toBe("online");
    expect(online?.longDescription).toMatch(/Zoom/i);
    expect(wedding?.deliveryMode).toBe("in-studio");
    expect(wedding?.longDescription).toMatch(/couple|choreograph/i);
    expect(getConfirmedProgrammes().length).toBeGreaterThanOrEqual(7);
  });

  it("trainers and member stories stay honest and noindex-ready", () => {
    expect(shouldIndexTrainersRoute()).toBe(false);
    expect(shouldIndexMemberStoriesRoute()).toBe(false);
    const trainers = getStudioTrainersPage();
    expect(trainers.headline).toBe("Meet the coaching team");
    expect(trainers.readinessBody).not.toMatch(FORBIDDEN_PUBLIC);
    expect(trainers.readinessBody).toMatch(/WhatsApp/);
    const stories = getStudioMemberStoriesPage();
    expect(stories.readinessBody).toMatch(/No member stories are published yet/);
    expect(stories.readinessBody).not.toMatch(/before\/after|%\s*body fat|5-star/i);
  });

  it("does not invent Review/AggregateRating structured data", () => {
    const page = buildWebPageJsonLd({
      name: "Locations",
      description: "Four neighbourhood studios",
      path: "/locations",
    });
    const crumbs = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Locations", path: "/locations" },
    ]);
    expect(serializeJsonLd(page)).not.toMatch(FORBIDDEN_SD);
    expect(serializeJsonLd(crumbs)).not.toMatch(FORBIDDEN_SD);
    const sdLib = read("src", "lib", "seo", "structured-data.ts");
    expect(sdLib).not.toMatch(/AggregateRating|Review/);
  });

  it("customer-facing marketing routes avoid internal provenance labels", () => {
    const paths = [
      ["src", "app", "(marketing)", "page.tsx"],
      ["src", "app", "(marketing)", "pricing", "page.tsx"],
      ["src", "app", "(marketing)", "trial", "page.tsx"],
      ["src", "app", "(marketing)", "contact", "page.tsx"],
      ["src", "app", "(marketing)", "trainers", "page.tsx"],
      ["src", "content", "mock", "studio-about.ts"],
      ["src", "content", "mock", "studio-trainers-page.ts"],
      ["src", "content", "mock", "studio-member-stories-page.ts"],
    ] as const;
    for (const parts of paths) {
      const source = read(...parts);
      // Content schema status fields are allowed in mock modules; strip those lines for the check.
      const customerFacing = parts.some((p) => p === "mock")
        ? source
            .split("\n")
            .filter(
              (line) =>
                !/dataStatus|Status:|Provenance|ownerSource|OWNER_|credentialsStatus|founderStoryStatus|foundingDateStatus|teamSizeProvenance/.test(
                  line,
                ),
            )
            .join("\n")
        : source;
      expect(customerFacing, parts.join("/")).not.toMatch(FORBIDDEN_PUBLIC);
    }
  });
});
