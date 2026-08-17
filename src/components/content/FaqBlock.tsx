import styles from "./faq-block.module.css";

export type FaqBlockItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqBlockProps = {
  items: FaqBlockItem[];
  titleId?: string;
  heading?: string;
};

/**
 * Content-aware FAQ presentation.
 * 0 → nothing. 1 → Good to know (never a FAQ chapter). 2 → compact Q&A. 3+ → accordion.
 */
export function FaqBlock({ items, titleId = "faq-title", heading = "FAQ" }: FaqBlockProps) {
  if (items.length === 0) return null;

  if (items.length === 1) {
    const item = items[0]!;
    return (
      <aside className={styles.goodToKnow} aria-label="Good to know">
        <p className={styles.kicker}>Good to know</p>
        <p className={styles.goodBody}>
          <span className={styles.goodQ}>{item.question}</span> {item.answer}
        </p>
      </aside>
    );
  }

  if (items.length === 2) {
    return (
      <section className={styles.qa} aria-labelledby={titleId}>
        <h2 id={titleId} className={styles.qaTitle}>
          Good to know
        </h2>
        <dl className={styles.qaList}>
          {items.map((item) => (
            <div key={item.id} className={styles.qaItem}>
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  return (
    <section className={styles.faq} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.faqTitle}>
        {heading}
      </h2>
      <div className="pulse-accordion">
        {items.map((item) => (
          <details key={item.id} className="pulse-accordion-item">
            <summary>{item.question}</summary>
            <div className="pulse-accordion-panel">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
