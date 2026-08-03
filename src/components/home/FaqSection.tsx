import styles from "./pulse/pulse-home.module.css";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  mockDisclaimer?: string;
};

export type FaqSectionProps = {
  items: FaqItem[];
  description?: string;
};

/**
 * Server-rendered FAQ using native disclosure widgets — dark Pulse accordion.
 */
export function FaqSection({
  items,
  description = "Short answers based on confirmed studio information.",
}: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      id="faq"
      className={`${styles.field} ${styles.band}`}
      aria-labelledby="home-faq-title"
    >
      <p className={styles.faqKicker}>FAQ</p>
      <h2 id="home-faq-title" className={styles.bandTitle}>
        Quick answers
      </h2>
      <p className={styles.bandLede}>{description}</p>
      <div className="pulse-accordion">
        {items.map((item) => (
          <details key={item.id} className="pulse-accordion-item group">
            <summary>
              <span className={styles.faqSummary}>
                {item.question}
                <span
                  aria-hidden
                  className={`${styles.faqToggle} group-open:rotate-45`}
                >
                  +
                </span>
              </span>
            </summary>
            <div className="pulse-accordion-panel">
              <p className="pulse-body">{item.answer}</p>
              {item.mockDisclaimer ? (
                <p className={styles.disclaimer}>{item.mockDisclaimer}</p>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
