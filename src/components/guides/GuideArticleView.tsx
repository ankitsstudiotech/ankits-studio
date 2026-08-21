import Link from "next/link";
import type { Guide, GuideBlock } from "@/content";
import { SectionReveal } from "@/components/motion";
import styles from "./guides.module.css";

type InlineChild = Extract<GuideBlock, { type: "p" }>["children"][number];

function InlineParts({ parts }: { parts: InlineChild[] }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <Link key={`${part.href}-${index}`} href={part.href}>
            {part.label}
          </Link>
        ),
      )}
    </>
  );
}

function GuideBlocks({ blocks }: { blocks: Guide["blocks"] }) {
  return (
    <div>
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2 key={`h2-${index}`} className={styles.sectionTitle}>
              {block.text}
            </h2>
          );
        }
        if (block.type === "p") {
          return (
            <p key={`p-${index}`} className={styles.body}>
              <InlineParts parts={block.children} />
            </p>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={`ul-${index}`} className={styles.list}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <div key={`table-${index}`} className={styles.tableWrap}>
            {block.caption ? <p className={styles.tableCaption}>{block.caption}</p> : null}
            <table className={styles.table}>
              <thead>
                <tr>
                  {block.headers.map((header) => (
                    <th key={header || "blank"} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export type GuideArticleViewProps = {
  guide: Guide;
  related: Guide[];
  programmeName: string;
  programmeHref: string;
  ctaHref: string;
};

export function GuideArticleView({
  guide,
  related,
  programmeName,
  programmeHref,
  ctaHref,
}: GuideArticleViewProps) {
  return (
    <>
      <section className={styles.band} aria-labelledby="guide-title">
        <div className={styles.shell}>
          <div className={styles.openMeasure}>
            <p className={styles.kicker}>{guide.clusterLabel}</p>
            <h1 id="guide-title" className={styles.title}>
              {guide.h1}
            </h1>
            <p className={styles.lede}>{guide.excerpt}</p>
          </div>
        </div>
      </section>

      <section className={styles.band} aria-label="Guide">
        <div className={styles.shell}>
          <SectionReveal>
            <GuideBlocks blocks={guide.blocks} />
          </SectionReveal>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="guide-next">
        <div className={styles.shell}>
          <SectionReveal>
            <h2 id="guide-next" className={styles.sectionTitle}>
              Next step
            </h2>
            <p className={styles.body}>
              Explore{" "}
              <Link href={programmeHref}>{programmeName}</Link> at Ankit’s Studio, or message us
              directly.
            </p>
            <div className={styles.ctaRow}>
              <a className={styles.ctaPrimary} href={ctaHref}>
                {guide.ctaLabel}
              </a>
              <Link className={styles.ctaSecondary} href={programmeHref}>
                View {programmeName}
              </Link>
            </div>
            <p className={styles.author}>
              Written by{" "}
              <Link href="/about">Ankit’s Studio Team</Link>
            </p>
          </SectionReveal>
        </div>
      </section>

      {related.length > 0 ? (
        <section className={styles.band} aria-labelledby="guide-related">
          <div className={styles.shell}>
            <SectionReveal>
              <h2 id="guide-related" className={styles.sectionTitle}>
                Related guides
              </h2>
              <ul className={styles.linkList}>
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/guides/${item.slug}`}>
                      <span className={styles.linkTitle}>{item.title}</span>
                      <span className={styles.linkMeta}>{item.excerpt}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </SectionReveal>
          </div>
        </section>
      ) : null}
    </>
  );
}
