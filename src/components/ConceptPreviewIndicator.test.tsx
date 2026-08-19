import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConceptPreviewIndicator } from "./ConceptPreviewIndicator";

describe("ConceptPreviewIndicator", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders nothing outside full concept-preview mode", () => {
    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "false");
    const { container } = render(<ConceptPreviewIndicator />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the concept marker when both flags are true", () => {
    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    render(<ConceptPreviewIndicator />);
    expect(screen.getByRole("status")).toHaveAttribute("data-concept-preview", "true");
    expect(screen.getByRole("status").textContent).toMatch(/Concept preview/i);
    expect(screen.getByRole("status").textContent).not.toMatch(/Mock preview|Development preview/i);
  });
});
