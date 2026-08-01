import Link from "next/link";
import {
  getBusinessIdentity,
  getProgrammes,
  getPubliclyListedBranches,
} from "@/content";
import { MockMediaPlate, PrototypeBanner } from "../_revamp/shared";
import { BeatStrip, PulseCta, TempoLane } from "./motion";
import styles from "./revamp-b.module.css";

export default function RevampBPage() {
  const programmes = getProgrammes();
  const branches = getPubliclyListedBranches();
  const identity = getBusinessIdentity();

  return (
    <div className={styles.root}>
      <a className={styles.skip} href="#rb-main">
        Skip to content
      </a>
      <PrototypeBanner code="B" title="Studio Pulse" />

      <header className={styles.pulseNav}>
        <Link href="/design-lab/revamp-b" className={styles.brand}>
          {identity.displayName}
        </Link>
        <a href="#rb-lanes">Tempos</a>
        <a href="#rb-story">Pulse</a>
        <a href="#rb-nodes">Branches</a>
        <a href="#rb-trial">Trial</a>
        <Link href="/design-lab">Lab</Link>
      </header>

      <main id="rb-main">
        <section className={styles.hero} aria-labelledby="rb-hero-h">
          <div className={styles.heroCopy}>
            <h1 id="rb-hero-h">FEEL THE ROOM&apos;S TEMPO</h1>
            <p>
              Strength hits. Yoga holds. Dance grooves. Pick the energy that
              fits your week — then book a trial at Airoli or Ghansoli.
            </p>
            <BeatStrip />
          </div>
          <div className={styles.heroStack} aria-hidden={false}>
            <div className={styles.layerA}>
              <MockMediaPlate
                family="high-energy"
                label="Layer A · community energy"
                aspect="4/5"
              />
            </div>
            <div className={styles.layerB}>
              <MockMediaPlate
                family="strength"
                label="Layer B · floor tension"
                aspect="4/5"
              />
            </div>
          </div>
        </section>

        <section id="rb-lanes" className={styles.band} aria-labelledby="rb-lanes-h">
          <h2 id="rb-lanes-h">TEMPO LANES</h2>
          <div className={styles.lanes}>
            {programmes.map((programme) => (
              <TempoLane
                key={programme.slug}
                family={programme.heroAccent}
                name={programme.name}
                description={programme.shortDescription}
                href={`/programs/${programme.slug}`}
              />
            ))}
          </div>
        </section>

        <section id="rb-story" className={styles.band} aria-labelledby="rb-story-h">
          <h2 id="rb-story-h">COMMUNITY PULSE</h2>
          <div className={styles.story}>
            <MockMediaPlate
              family="high-energy"
              label="Community pulse · class energy"
              aspect="16/9"
            />
            <div className={styles.storyCopy}>
              <p>
                The studio is not one vibe — it is a week of different tempos
                sharing equipment, instructors, and floor space.
              </p>
              <p>
                This direction makes rhythm structural: lanes, beat marks, and
                spring press feedback — with a hard reduced-motion path that
                keeps every lane readable.
              </p>
            </div>
          </div>
        </section>

        <section id="rb-nodes" className={styles.band} aria-labelledby="rb-nodes-h">
          <h2 id="rb-nodes-h">BRANCH NODES</h2>
          <div className={styles.nodes}>
            {branches.length === 0 ? (
              <div className={styles.node}>
                <h3>NONE</h3>
                <p>No publicly listed branches in this content mode.</p>
              </div>
            ) : (
              branches.map((branch) => (
                <Link
                  key={branch.slug}
                  href={`/locations/${branch.slug}`}
                  className={styles.node}
                >
                  <h3>{branch.name.toUpperCase()}</h3>
                  <p>{branch.programmeSlugs.length} programmes linked</p>
                  {branch.dataStatus !== "verified" ? (
                    <p className={styles.disclaimer}>{branch.mockDisclaimer}</p>
                  ) : null}
                </Link>
              ))
            )}
          </div>
        </section>

        <section id="rb-trial" className={styles.ctaBand} aria-labelledby="rb-trial-h">
          <h2 id="rb-trial-h">BOOK THE TRIAL. KEEP THE PULSE.</h2>
          <PulseCta href="/book-a-free-trial">Book free trial</PulseCta>
        </section>
      </main>
    </div>
  );
}
