import { describe, expect, it } from "vitest";
import {
  getBranchBySlug,
  getBranches,
  getBusinessIdentity,
  getContactDetails,
  getStudioCommercial,
  getStudioContactLinks,
  getBranchContactLinks,
  getPubliclyListedBranches,
} from "@/content";

const CENTRAL = "+91 93724 02074";

describe("Thane listing after owner confirmation", () => {
  it("lists Thane publicly with pending printable address", () => {
    const thane = getBranchBySlug("thane");
    expect(thane?.publiclyListed).toBe(true);
    expect(thane?.address).toBeNull();
    expect(thane?.fieldProvenance.address).toBe("pending");
    expect(thane?.mapsUrl).toContain("maps.app.goo.gl");
  });
});

describe("four-branch model", () => {
  it("includes Airoli Sector 19, Sector 8, Ghansoli, and Thane", () => {
    const slugs = getBranches()
      .map((b) => b.slug)
      .sort();
    expect(slugs).toEqual(["airoli-sector-19", "airoli-sector-8", "ghansoli", "thane"]);
    expect(getPubliclyListedBranches()).toHaveLength(4);
  });

  it("keeps Sector 8 without a Maps URL", () => {
    expect(getBranchBySlug("airoli-sector-8")?.mapsUrl).toBeNull();
    expect(getBranchBySlug("airoli-sector-8")?.fieldProvenance.mapsUrl).toBe("pending");
  });
});

describe("central enquiry phone / WhatsApp", () => {
  it("stores the owner-confirmed central number on contact details", () => {
    const contact = getContactDetails();
    expect(contact.dataStatus).toBe("verified");
    expect(contact.generalPhone).toBe(CENTRAL);
    expect(contact.generalWhatsapp).toBe(CENTRAL);
    expect(contact.preferredContactOrder[0]).toBe("whatsapp");
    expect(contact.branchesInheritCentralEnquiry).toBe(true);
  });

  it("exposes dialable studio links when contact is verified", () => {
    const links = getStudioContactLinks();
    expect(links.phoneHref).toBe("tel:+919372402074");
    expect(links.whatsappHref).toBe("https://wa.me/919372402074");
    expect(links.emailHref).toBe("mailto:ankitsstudio5@gmail.com");
  });

  it("exposes branch tel/wa.me once the branch record is verified", () => {
    for (const branch of getBranches()) {
      expect(branch.dataStatus).toBe("verified");
      expect(branch.phone).toBe(CENTRAL);
      expect(branch.whatsapp).toBe(CENTRAL);
      expect(branch.inheritsCentralEnquiry).toBe(true);
      const links = getBranchContactLinks(branch);
      expect(links.phoneHref).toBe("tel:+919372402074");
      expect(links.whatsappHref).toBe("https://wa.me/919372402074");
    }
  });
});

describe("operating window vs timetable", () => {
  it("uses 06:00–22:00 operating windows on every branch", () => {
    for (const branch of getBranches()) {
      expect(branch.openingHoursKind).toBe("operating-window");
      expect(branch.openingHours).toHaveLength(7);
      for (const entry of branch.openingHours) {
        expect(entry.opensAt).toBe("06:00");
        expect(entry.closesAt).toBe("22:00");
      }
    }
  });
});

describe("commercial facts", () => {
  it("records free trial, registration fee, and batch audience options", () => {
    const commercial = getStudioCommercial();
    expect(commercial.dataStatus).toBe("verified");
    expect(commercial.trialIsFree).toBe(true);
    expect(commercial.registrationFeeInr).toBe(300);
    expect(commercial.programmeFeesStatus).toBe("pending");
    expect(commercial.maxGroupBatchSize).toBe(15);
    expect(commercial.ladiesOnlyBatchesAvailable).toBe(true);
    expect(commercial.kidsOnlyBatchesAvailable).toBe(true);
  });
});

describe("no medical or guaranteed-outcome claims", () => {
  it("business identity description/tagline contain no medical or guarantee claim", () => {
    const FORBIDDEN = /\b(guarantee[ds]?|cure[sd]?|medical(?:ly)? proven|clinically proven)\b/i;
    const identity = getBusinessIdentity();
    expect(identity.description).not.toMatch(FORBIDDEN);
    expect(identity.tagline).not.toMatch(FORBIDDEN);
  });
});

describe("mapEmbedUrl remains unset without embed URLs", () => {
  it("does not invent mapEmbedUrl on verified branches", () => {
    for (const branch of getBranches()) {
      expect(branch.dataStatus).toBe("verified");
      expect(branch.mapEmbedUrl).toBeUndefined();
    }
  });
});

describe("brand identity", () => {
  it("keeps Dance & Fitness as logo descriptor, not legal name", () => {
    const identity = getBusinessIdentity();
    expect(identity.displayName).toBe("Ankit's Studio");
    expect(identity.legalName).toBe("Ankit's Studio");
    expect(identity.logoDescriptor).toBe("Dance & Fitness");
  });
});
