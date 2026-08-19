import Link from "next/link";
import styles from "./logo-integration.module.css";

export const metadata = {
  title: "Logo × Studio Pulse accent comparison | Design Lab",
  robots: { index: false, follow: false },
};

/**
 * Design-lab only. Does not modify production tokens.
 * Compares Pulse coral CTAs vs logo-derived magenta/purple actions.
 */
export default function LogoIntegrationPage() {
  return (
    <main className={styles.page}>
      <p className={styles.kicker}>Design lab · noindex · production tokens unchanged</p>
      <h1 className={styles.title}>Studio Pulse × official logo accents</h1>
      <p className={styles.lede}>
        Option A keeps production coral actions. Option B trials a flat logo-derived action accent while
        warning amber stays separate. Assets are temporary white-field crops from the official PDF.
      </p>
      <p className={styles.back}>
        <Link href="/design-lab">← Design lab</Link>
      </p>

      <div className={styles.grid}>
        <section className={styles.panel} data-option="a" aria-labelledby="opt-a">
          <h2 id="opt-a">A · Pulse coral action</h2>
          <p className={styles.meta}>Accent `#FF4D2E` · warning stays amber · logo on white plate</p>

          <div className={styles.darkBand}>
            <div className={styles.headerRow}>
              <img
                src="/brand/ankits-studio-symbol.png"
                alt=""
                width={32}
                height={32}
                className={styles.symbolOnDark}
              />
              <span className={styles.brandWord}>Ankit’s Studio</span>
              <span className={`${styles.cta} ${styles.ctaCoral}`}>Book a free trial</span>
            </div>
            <div className={styles.sizeRow}>
              {[24, 32, 48].map((size) => (
                <img
                  key={`a-sym-${size}`}
                  src="/brand/ankits-studio-symbol.png"
                  alt=""
                  width={size}
                  height={size}
                  className={styles.symbolOnDark}
                />
              ))}
            </div>
            <div className={styles.warnRow}>
              <span className={styles.warnChip}>Mock preview</span>
              <span className={`${styles.cta} ${styles.ctaCoral}`}>Primary CTA</span>
            </div>
          </div>

          <div className={styles.lightBand}>
            <img
              src="/brand/ankits-studio-lockup-light-480.webp"
              alt="Ankit’s Studio — Dance & Fitness lockup"
              className={styles.lockup}
              width={240}
              height={168}
            />
            <span className={`${styles.cta} ${styles.ctaCoral}`}>Book a free trial</span>
          </div>
        </section>

        <section className={styles.panel} data-option="b" aria-labelledby="opt-b">
          <h2 id="opt-b">B · Logo-derived action</h2>
          <p className={styles.meta}>
            Action `#6B2F7A` (deep purple) · hover `#9E4B7B` (logo magenta) · warning amber unchanged
          </p>

          <div className={styles.darkBand}>
            <div className={styles.headerRow}>
              <img
                src="/brand/ankits-studio-symbol.png"
                alt=""
                width={32}
                height={32}
                className={styles.symbolOnDark}
              />
              <span className={styles.brandWord}>Ankit’s Studio</span>
              <span className={`${styles.cta} ${styles.ctaBrand}`}>Book a free trial</span>
            </div>
            <div className={styles.sizeRow}>
              {[24, 32, 48].map((size) => (
                <img
                  key={`b-sym-${size}`}
                  src="/brand/ankits-studio-symbol.png"
                  alt=""
                  width={size}
                  height={size}
                  className={styles.symbolOnDark}
                />
              ))}
            </div>
            <div className={styles.warnRow}>
              <span className={styles.warnChip}>Mock preview</span>
              <span className={`${styles.cta} ${styles.ctaBrand}`}>Primary CTA</span>
            </div>
          </div>

          <div className={styles.lightBand}>
            <img
              src="/brand/ankits-studio-lockup-light-480.webp"
              alt="Ankit’s Studio — Dance & Fitness lockup"
              className={styles.lockup}
              width={240}
              height={168}
            />
            <span className={`${styles.cta} ${styles.ctaBrand}`}>Book a free trial</span>
          </div>
        </section>
      </div>

      <section className={styles.notes}>
        <h2>Quick read</h2>
        <ul>
          <li>Symbol on dark needs a light plate — white-field PNG reads as a tile, not a floating mark.</li>
          <li>Coral CTAs stay loud and Pulse-native but sit outside the logo’s purple/pink family.</li>
          <li>Deep-purple CTAs align with the wordmark; keep warning amber distinct from action.</li>
          <li>Full assessment: <code>docs/brand/STUDIO-PULSE-LOGO-INTEGRATION.md</code></li>
        </ul>
      </section>
    </main>
  );
}
