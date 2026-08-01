import Link from "next/link";
import {
  getBusinessIdentity,
  getProgrammes,
  getPubliclyListedBranches,
} from "@/content";
import { MockMediaPlate, PrototypeBanner } from "@/components/design-lab/shared/shared";
import { SystemRow, UtilityCta } from "./motion";
import styles from "./revamp-c.module.css";

/**
 * Frozen Movement System prototype view.
 * Visual implementation must not depend on production design tokens.
 */
export function RevampCView() {
  const programmes = getProgrammes();
  const branches = getPubliclyListedBranches();
  const identity = getBusinessIdentity();

  return (
    <div
      className={styles.root}
      data-design-lab-prototype="c"
      data-frozen-prototype="true"
      data-prototype-typography="movement-system"
    >
      <a className={styles.skip} href="#rc-main">
        Skip to content
      </a>
      <PrototypeBanner code="C" title="Movement System" />

      <header className={styles.sysNav}>
        <Link href="/design-lab/revamp-c" className={styles.brand}>
          {identity.displayName}
        </Link>
        <nav className={styles.navLinks} aria-label="Prototype primary">
          <a href="#rc-matrix">Programmes</a>
          <a href="#rc-protocol">Protocol</a>
          <a href="#rc-geo">Branches</a>
          <a href="#rc-trial">Trial</a>
          <Link href="/design-lab">Lab</Link>
        </nav>
        <span className={styles.mono}>SYS · 01</span>
      </header>

      <main id="rc-main">
        <section className={styles.hero} aria-labelledby="rc-hero-h">
          <div className={styles.heroJobs}>
            <p className={styles.mono}>Job statements</p>
            <h1 id="rc-hero-h">Choose a programme. Confirm a branch. Book a trial.</h1>
            <ol className={styles.jobList}>
              <li>
                <span className={styles.mono}>01</span>
                <span>Discover an appropriate programme for your goal</span>
              </li>
              <li>
                <span className={styles.mono}>02</span>
                <span>Find Airoli or Ghansoli (Thane when listed)</span>
              </li>
              <li>
                <span className={styles.mono}>03</span>
                <span>Check timings when verified — book a free trial</span>
              </li>
            </ol>
          </div>
          <div className={styles.heroFrame}>
            <span className={styles.mono}>Media frame · 1:1 · replaceable</span>
            <MockMediaPlate
              family="strength"
              label="Technical crop guide"
              aspect="1/1"
            />
          </div>
        </section>

        <section
          id="rc-matrix"
          className={styles.section}
          aria-labelledby="rc-matrix-h"
        >
          <div className={styles.sectionHead}>
            <h2 id="rc-matrix-h">Programme matrix</h2>
            <span className={styles.mono}>{programmes.length} rows</span>
          </div>
          <div className={styles.matrix}>
            <div className={styles.matrixHead} aria-hidden>
              <span>Programme</span>
              <span>Family</span>
              <span>Audience</span>
              <span>Level</span>
            </div>
            {programmes.map((programme) => (
              <SystemRow
                key={programme.slug}
                href={`/programs/${programme.slug}`}
                className="rc-row"
              >
                <strong>{programme.name}</strong>
                <span>{programme.heroAccent}</span>
                <span>{programme.audienceTags.slice(0, 2).join(" · ") || "—"}</span>
                <span>{programme.difficulty}</span>
              </SystemRow>
            ))}
          </div>
        </section>

        <section
          id="rc-protocol"
          className={styles.section}
          aria-labelledby="rc-protocol-h"
        >
          <div className={styles.sectionHead}>
            <h2 id="rc-protocol-h">Studio protocol</h2>
            <span className={styles.mono}>Story module</span>
          </div>
          <div className={styles.protocol}>
            <MockMediaPlate
              family="calm"
              label="Protocol · calm floor frame"
              aspect="4/5"
            />
            <div className={styles.protocolCopy}>
              <p>
                Movement System treats the site like an operating surface:
                scannable rows, geographic index, and state-only motion at
                150–200ms — no scroll-reveal theatre.
              </p>
              <p>
                Parents and planners get programme + branch + trial without
                competing marketing sections. Mock contact details stay flagged;
                verified content would unlock call and maps links.
              </p>
            </div>
          </div>
        </section>

        <section id="rc-geo" className={styles.section} aria-labelledby="rc-geo-h">
          <div className={styles.sectionHead}>
            <h2 id="rc-geo-h">Geographic index</h2>
            <span className={styles.mono}>Listed branches</span>
          </div>
          <div className={styles.geo}>
            {branches.length === 0 ? (
              <div className={styles.geoItem}>
                <span className={styles.flag}>empty</span>
                <h3>No public branches</h3>
                <p className={styles.disclaimer}>
                  Content mode returned an empty publicly listed set.
                </p>
              </div>
            ) : (
              branches.map((branch) => (
                <Link
                  key={branch.slug}
                  href={`/locations/${branch.slug}`}
                  className={styles.geoItem}
                >
                  {branch.dataStatus !== "verified" ? (
                    <span className={styles.flag}>{branch.dataStatus}</span>
                  ) : (
                    <span className={styles.flag} style={{ color: "#0a7a3e" }}>
                      verified
                    </span>
                  )}
                  <h3>{branch.name}</h3>
                  <p className={styles.mono}>
                    {branch.programmeSlugs.length} programmes
                  </p>
                  {branch.dataStatus !== "verified" ? (
                    <p className={styles.disclaimer}>{branch.mockDisclaimer}</p>
                  ) : null}
                </Link>
              ))
            )}
          </div>
        </section>

        <section
          id="rc-trial"
          className={styles.trialModule}
          aria-labelledby="rc-trial-h"
        >
          <div>
            <h2 id="rc-trial-h">Trial module</h2>
            <p>
              Adjacent to branch discovery in the reading order — one clear
              conversion after place trust.
            </p>
          </div>
          <UtilityCta href="/book-a-free-trial">Book a free trial</UtilityCta>
        </section>
      </main>

      <div className={styles.stickyTrial}>
        <UtilityCta href="/book-a-free-trial">Book a free trial</UtilityCta>
      </div>
    </div>
  );
}
