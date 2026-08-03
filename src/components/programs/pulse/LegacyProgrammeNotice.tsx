import Link from "next/link";
import type { Programme } from "@/content";
import styles from "./programme-pulse.module.css";

export type LegacyProgrammeNoticeProps = {
  programme: Programme;
  relatedName?: string;
  relatedHref?: string;
  whatsappHref: string;
};

/** Older programme URL — kept for people who found a legacy link; noindex. */
export function LegacyProgrammeNotice({
  programme,
  relatedName,
  relatedHref,
  whatsappHref,
}: LegacyProgrammeNoticeProps) {
  return (
    <div>
      <div className={styles.legacyBanner} role="status">
        This page is kept for people who found an older link. It is not listed among our current
        programmes.
      </div>
      <section className={styles.surfaceBand} aria-labelledby="legacy-title">
        <h1 id="legacy-title">{programme.name}</h1>
        <p>{programme.longDescription}</p>
        <p>
          <Link href="/programs">Browse current programmes →</Link>
        </p>
        {relatedName && relatedHref ? (
          <p>
            Related service: <Link href={relatedHref}>{relatedName}</Link>
          </p>
        ) : null}
        <p>
          <a
            href={whatsappHref}
            {...(whatsappHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            Ask on WhatsApp which current service fits →
          </a>
        </p>
      </section>
    </div>
  );
}
