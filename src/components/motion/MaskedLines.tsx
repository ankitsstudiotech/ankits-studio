import type { CSSProperties } from "react";

export type MaskedLinesProps = {
  lines: string[];
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

/**
 * Editorial line mask — overflow clip + whole-line rise.
 * Server Component safe: CSS owns visibility (prm / reduce / no-JS = final).
 * Kept out of PulseReveal so home/programme H1 does not pull `motion/react`
 * into the critical client graph for LCP.
 */
export function MaskedLines({
  lines,
  as: Tag = "h1",
  id,
  className = "",
}: MaskedLinesProps) {
  return (
    <Tag id={id} className={["hero-masked-title", className].filter(Boolean).join(" ")}>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className="motion-mask-line"
          style={{ "--line-index": index } as CSSProperties}
        >
          <span className="motion-mask-inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
