import type { ProgrammeAccentFamily } from "@/content/schema";

const FAMILY_LABEL: Record<ProgrammeAccentFamily, string> = {
  strength: "Strength floor",
  calm: "Calm floor",
  "high-energy": "Energy floor",
};

type MockMediaPlateProps = {
  family: ProgrammeAccentFamily;
  label: string;
  aspect?: "3/4" | "4/5" | "16/9" | "1/1" | "21/9";
  className?: string;
};

/**
 * Art-directed replaceable mock media. Not stock photography — geometric
 * compositions tagged for later swap with real studio assets.
 * Isolate under `data-mock-media` for production media replacement.
 */
export function MockMediaPlate({
  family,
  label,
  aspect = "4/5",
  className = "",
}: MockMediaPlateProps) {
  return (
    <div
      data-mock-media="true"
      data-mock-media-family={family}
      className={className}
      style={{
        aspectRatio: aspect.replace("/", " / "),
        position: "relative",
        overflow: "hidden",
        background:
          family === "strength"
            ? "linear-gradient(145deg, #1a1a1a 0%, #3d3428 45%, #8b6914 100%)"
            : family === "calm"
              ? "linear-gradient(160deg, #1e2420 0%, #3a4a42 50%, #7a9a88 100%)"
              : "linear-gradient(125deg, #1a1018 0%, #4a2030 40%, #c45c26 100%)",
      }}
      role="img"
      aria-label={`Replaceable mock media: ${label}. ${FAMILY_LABEL[family]}.`}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(-18deg, transparent, transparent 11px, rgba(255,255,255,0.04) 11px, rgba(255,255,255,0.04) 12px)",
        }}
      />
      <span
        style={{
          position: "absolute",
          left: "0.75rem",
          bottom: "0.75rem",
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.85)",
          background: "rgba(0,0,0,0.45)",
          padding: "0.35rem 0.5rem",
          maxWidth: "90%",
        }}
      >
        REPLACE · {label}
      </span>
    </div>
  );
}

export function PrototypeBanner({
  code,
  title,
}: {
  code: "A" | "B" | "C";
  title: string;
}) {
  return (
    <div
      role="status"
      style={{
        background: "#111",
        color: "#f5f0e8",
        fontSize: "0.75rem",
        padding: "0.5rem 1rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem 1rem",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>
        Design lab prototype {code}: {title}. Internal only · noindex · uses
        centralised content accessors.
      </span>
      <nav aria-label="Other prototypes" style={{ display: "flex", gap: "0.75rem" }}>
        <a href="/design-lab/revamp-a" style={{ color: "#f5f0e8" }}>
          A
        </a>
        <a href="/design-lab/revamp-b" style={{ color: "#f5f0e8" }}>
          B
        </a>
        <a href="/design-lab/revamp-c" style={{ color: "#f5f0e8" }}>
          C
        </a>
      </nav>
    </div>
  );
}
