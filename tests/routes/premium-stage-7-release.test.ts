import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getBranchMapsUrl,
  getContactDetails,
  getPubliclyListedBranches,
  getStudioContactLinks,
} from "@/content";
import { siteConfig } from "@/lib/metadata";
import { buildOrganizationJsonLd } from "@/lib/seo/structured-data";
import { getBusinessIdentity } from "@/content";
import { buildWhatsAppTrialUrl, getPrimaryConversionHref } from "@/lib/conversion";

const read = (...parts: string[]) => readFileSync(join(process.cwd(), ...parts), "utf8");

describe("Stage 7 — production metadata and brand wiring", () => {
  it("wires brand icons and Studio Pulse theme in root metadata + manifest", () => {
    const meta = read("src", "lib", "metadata.ts");
    expect(meta).toMatch(/applicationName/);
    expect(meta).toMatch(/favicon-32\.png/);
    expect(meta).toMatch(/favicon-180\.png/);
    expect(siteConfig.description).toMatch(/four neighbourhood studios/i);
    expect(siteConfig.description).not.toMatch(/localhost/i);

    const manifest = read("src", "app", "manifest.ts");
    expect(manifest).toMatch(/#0e0e10/);
    expect(manifest).toMatch(/favicon-192\.png/);
    expect(manifest).not.toMatch(/\/favicon\.ico/);
  });

  it("ships a brand-only Open Graph card without synthetic photography", () => {
    const og = read("src", "app", "opengraph-image.tsx");
    expect(og).toMatch(/1200/);
    expect(og).toMatch(/630/);
    expect(og).toMatch(/ankits-studio-symbol-transparent/);
    expect(og).toMatch(/Fitness · Yoga · Zumba · Dance/);
    expect(og).not.toMatch(/synthetic-preview|AI concept/i);
  });

  it("keeps Organization logo factual and NAP contact consistent", () => {
    const org = buildOrganizationJsonLd(getBusinessIdentity());
    expect(org?.logo).toMatch(/\/brand\/ankits-studio-symbol-transparent\.png$/);
    const contact = getContactDetails();
    expect(contact.generalPhone).toMatch(/93724/);
    expect(contact.generalEmail).toMatch(/ankitsstudio5@gmail\.com/i);
    const links = getStudioContactLinks();
    expect(links.phoneHref).toBe("tel:+919372402074");
    expect(links.emailHref).toBe("mailto:ankitsstudio5@gmail.com");
  });
});

describe("Stage 7 — redirects links and release environment", () => {
  it("configures permanent redirects and security headers", () => {
    const config = read("next.config.ts");
    expect(config).toMatch(/book-a-free-trial/);
    expect(config).toMatch(/airoli-sector-19/);
    expect(config).toMatch(/permanent:\s*true/);
    expect(config).toMatch(/X-Content-Type-Options/);
    expect(config).toMatch(/Referrer-Policy/);
    expect(config).toMatch(/assertProductionReleaseSafe/);
    expect(config).not.toMatch(/Content-Security-Policy/);
  });

  it("exposes Maps URLs with safe attributes in location surfaces", () => {
    for (const branch of getPubliclyListedBranches()) {
      expect(getBranchMapsUrl(branch)).toMatch(/^https:\/\/www\.google\.com\/maps\?cid=\d+$/);
      expect(getBranchMapsUrl(branch)).not.toMatch(/\/maps\/dir\//);
      expect(getBranchMapsUrl(branch)).not.toMatch(/destination=/);
    }
    const row = read("src", "components", "locations", "BranchRow.tsx");
    expect(row).toMatch(/noopener noreferrer/);
    const detail = read("src", "components", "locations", "pulse", "BranchDetailView.tsx");
    expect(detail).toMatch(/noopener noreferrer/);
  });

  it("WhatsApp trial href uses digits-only wa.me number", () => {
    const href = getPrimaryConversionHref();
    expect(href).toMatch(/^https:\/\/wa\.me\/919372402074/);
    const built = buildWhatsAppTrialUrl({ interestedService: "Yoga" });
    expect(built).toMatch(/^https:\/\/wa\.me\/919372402074\?text=/);
    expect(built).not.toMatch(/wa\.me\/\+91/);
  });
});
