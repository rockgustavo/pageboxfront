import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles["header-title"]}>
        Pagebox
      </a>
      <div></div>
    </header>
  );
}
