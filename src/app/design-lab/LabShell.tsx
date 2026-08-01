import { Figtree, Syne } from "next/font/google";
import "@/styles/studio.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["500", "600", "700"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/** Incumbent design-system wrapper for the component review page only. */
export function LabShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        syne.variable,
        figtree.variable,
        "studio-shell has-sticky-cta",
        "flex min-h-full flex-col",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
