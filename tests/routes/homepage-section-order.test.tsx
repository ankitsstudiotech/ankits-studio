import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { GoogleReviewProof } from "@/components/home/GoogleReviewProof";
import { BranchExplorer } from "@/components/home/BranchExplorer";
import type { GoogleSocialProof } from "@/lib/google-reviews";

beforeAll(() => {
  class MockIntersectionObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

const EXTERNAL: GoogleSocialProof = {
  mode: "external-links",
  branches: [
    {
      slug: "airoli-sector-19",
      locality: "Airoli Sector 19",
      mapsUrl: "https://maps.app.goo.gl/75pmKFuezsCSd5JP8",
    },
  ],
};

function readHomePageSource() {
  return readFileSync(
    join(process.cwd(), "src", "app", "(marketing)", "page.tsx"),
    "utf8",
  );
}

describe("homepage section order — final owner priority", () => {
  it("places BranchExplorer before GoogleReviewProof in the component tree", () => {
    const home = readHomePageSource();
    const branchIdx = home.indexOf("<BranchExplorer");
    const reviewIdx = home.indexOf("<GoogleReviewProof");
    const founderIdx = home.indexOf("<FounderHomeMoment");
    expect(branchIdx).toBeGreaterThan(-1);
    expect(reviewIdx).toBeGreaterThan(-1);
    expect(founderIdx).toBeGreaterThan(-1);
    expect(branchIdx).toBeLessThan(reviewIdx);
    expect(reviewIdx).toBeLessThan(founderIdx);
  });

  it("renders the external-links Google chapter when live reviews are unavailable", () => {
    const { container } = render(<GoogleReviewProof proof={EXTERNAL} />);
    expect(container.querySelector("#google-reviews")).toBeTruthy();
    expect(container.querySelector("[data-google-proof-mode='external-links']")).toBeTruthy();
    expect(container.textContent).toMatch(/What members say/);
    expect(container.textContent).not.toMatch(/failed to load|quota exceeded/i);
  });

  it("renders nothing when Google proof is unavailable", () => {
    const { container } = render(<GoogleReviewProof proof={{ mode: "unavailable" }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders Branches before Google Reviews in the document", () => {
    const { container } = render(
      <>
        <BranchExplorer
          locations={[
            {
              name: "Airoli Sector 19",
              href: "/locations/airoli-sector-19",
              locality: "Airoli Sector 19",
              openingYear: 2019,
              mapsUrl: "https://maps.example/airoli",
            },
          ]}
        />
        <GoogleReviewProof proof={EXTERNAL} />
      </>,
    );

    const branchSection = container.querySelector("#locations");
    const reviewSection = container.querySelector("#google-reviews");
    expect(branchSection).toBeTruthy();
    expect(reviewSection).toBeTruthy();

    const position = branchSection!.compareDocumentPosition(reviewSection!);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
