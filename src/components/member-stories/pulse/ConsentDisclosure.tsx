import styles from "./member-stories.module.css";

type ConsentDisclosureProps = {
  children: string;
};

/** Visible consent/source disclosure for publishable stories. */
export function ConsentDisclosure({ children }: ConsentDisclosureProps) {
  return <p className={styles.provenance}>{children}</p>;
}
