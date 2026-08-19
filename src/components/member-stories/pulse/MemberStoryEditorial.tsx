import Link from "next/link";
import type { MemberStory } from "@/content";
import styles from "./member-stories.module.css";

/**
 * Future editorial block for a publishable Member Story.
 * Do not call with mock or unverified data.
 */
export function MemberStoryEditorial({ story }: { story: MemberStory }) {
  return (
    <article className={styles.storyArticle}>
      <h3 className={styles.storyName}>{story.memberDisplayName}</h3>
      <p className={styles.body}>{story.storyText}</p>
      {story.memberProvidedQuote ? (
        <p className={styles.storyQuote}>{story.memberProvidedQuote}</p>
      ) : null}
      <p className={styles.provenance}>
        Published with the member’s permission.
        {story.programmeSlug ? (
          <>
            {" "}
            <Link href={`/programs/${story.programmeSlug}`}>Programme</Link>
          </>
        ) : null}
        {story.branchSlug ? (
          <>
            {" "}
            <Link href={`/locations/${story.branchSlug}`}>Branch</Link>
          </>
        ) : null}
      </p>
    </article>
  );
}
