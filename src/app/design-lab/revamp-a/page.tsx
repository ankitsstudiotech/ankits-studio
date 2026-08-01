import Link from "next/link";
import {
  getBusinessIdentity,
  getProgrammes,
  getPubliclyListedBranches,
} from "@/content";
import { MockMediaPlate, PrototypeBanner } from "../_revamp/shared";
import { EditorialHeroTitle, UnderlineLink } from "./motion";
import styles from "./revamp-a.module.css";

export default function RevampAPage() {
  const programmes = getProgrammes();
  const branches = getPubliclyListedBranches();
  const identity = getBusinessIdentity();

  return (
    <div className={styles.root}>
      <a className={styles.skip} href="#ra-main">
        Skip to content
      </a>
      <PrototypeBanner code="A" title="Kinetic Editorial" />

      <header className={styles.masthead}>
        <Link href="/design-lab/revamp-a" className={styles.brand}>
          {identity.displayName}
        </Link>
        <p className={styles.issue}>Vol. 01 · Movement in Navi Mumbai</p>
      </header>

      <nav className={styles.nav} aria-label="Prototype primary">
        <UnderlineLink href="#ra-programmes">Programmes</UnderlineLink>
        <UnderlineLink href="#ra-story">Studio</UnderlineLink>
        <UnderlineLink href="#ra-branches">Branches</UnderlineLink>
        <UnderlineLink href="#ra-trial">Book a trial</UnderlineLink>
        <UnderlineLink href="/design-lab">← Lab</UnderlineLink>
      </nav>

      <main id="ra-main">
        <section className={styles.hero} aria-labelledby="ra-hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Neighbourhood studio · Airoli &amp; Ghansoli</p>
            <div id="ra-hero-title">
              <EditorialHeroTitle>
                Seven disciplines.
                <br />
                One floor.
              </EditorialHeroTitle>
            </div>
            <p className={styles.lede}>
              Strength, yoga, Zumba, and dance for working adults and parents —
              find a programme, pick a branch, book a trial.
            </p>
          </div>
          <div className={styles.heroMedia}>
            <MockMediaPlate
              family="strength"
              label="Hero crop · studio atmosphere"
              aspect="3/4"
            />
          </div>
        </section>

        <section
          id="ra-programmes"
          className={styles.section}
          aria-labelledby="ra-prog-h"
        >
          <div className={styles.sectionHead}>
            <h2 id="ra-prog-h">Programme index</h2>
            <span className={styles.kicker}>{programmes.length} disciplines</span>
          </div>
          <div className={styles.programmeRail} role="list">
            {programmes.map((programme) => (
              <Link
                key={programme.slug}
                href={`/programs/${programme.slug}`}
                className={styles.programmeItem}
                role="listitem"
              >
                <span className={styles.kicker}>{programme.heroAccent}</span>
                <strong>{programme.name}</strong>
                <span>{programme.shortDescription}</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="ra-story" className={styles.section} aria-labelledby="ra-story-h">
          <div className={styles.sectionHead}>
            <h2 id="ra-story-h">Studio story</h2>
            <span className={styles.kicker}>Editorial</span>
          </div>
          <div className={styles.manifesto}>
            <blockquote className={styles.pull}>
              Not a franchise template — a place where strength and dance share
              the same week.
            </blockquote>
            <div className={styles.manifestoBody}>
              <MockMediaPlate
                family="calm"
                label="Studio story · quiet floor"
                aspect="16/9"
              />
              <p>
                Ankit&apos;s Studio sits between gym intensity and dance-school
                polish. Adults train strength beside parents booking kids dance;
                yoga shares the calendar with Zumba.
              </p>
              <p>
                This prototype explores magazine pacing — programmes as an index,
                not a card grid — so discovery feels authored, not templated.
              </p>
            </div>
          </div>
        </section>

        <section
          id="ra-branches"
          className={styles.section}
          aria-labelledby="ra-branch-h"
        >
          <div className={styles.sectionHead}>
            <h2 id="ra-branch-h">Branches</h2>
            <span className={styles.kicker}>Place before polish</span>
          </div>
          <div className={styles.branches}>
            {branches.length === 0 ? (
              <div className={styles.branchCol}>
                <h3>No listed branches</h3>
                <p>Public branch list is empty in this content mode.</p>
              </div>
            ) : (
              branches.map((branch) => (
                <article key={branch.slug} className={styles.branchCol}>
                  <h3>{branch.name}</h3>
                  <p>
                    Programmes offered:{" "}
                    {branch.programmeSlugs.length
                      ? branch.programmeSlugs.join(", ")
                      : "To be confirmed"}
                  </p>
                  {branch.dataStatus !== "verified" ? (
                    <p className={styles.disclaimer}>{branch.mockDisclaimer}</p>
                  ) : null}
                  <p style={{ marginTop: "1rem" }}>
                    <Link href={`/locations/${branch.slug}`} data-ra-link>
                      Branch notes →
                    </Link>
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        <section id="ra-trial" className={styles.trial} aria-labelledby="ra-trial-h">
          <h2 id="ra-trial-h">Book a free trial at the branch that fits your week.</h2>
          <Link href="/book-a-free-trial">Start trial form</Link>
        </section>
      </main>
    </div>
  );
}
