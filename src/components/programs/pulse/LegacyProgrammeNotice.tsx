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
    <div className={styles.legacyWrap}>
      <div className={styles.legacyBanner} role="status">
        This programme list has been updated.
      </div>
      <section className={styles.legacyBand} aria-labelledby="legacy-title">
        <h1 id="legacy-title" className={styles.legacyTitle}>
          {programme.name}
        </h1>
        <p className={styles.legacyBody}>{programme.longDescription}</p>
        <p className={styles.legacyBody}>
          <Link href="/programs">See current programmes</Link>
        </p>
        {relatedName && relatedHref ? (
          <p className={styles.legacyBody}>
            Related: <Link href={relatedHref}>{relatedName}</Link>
          </p>
        ) : null}
        <p className={styles.legacyCta}>
          <a
            href={whatsappHref}
            {...(whatsappHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            Enquire on WhatsApp
          </a>
        </p>
      </section>
    </div>
  );
}
