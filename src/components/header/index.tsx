import { useState } from "react";
import styles from "./Header.module.css";

export function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles["header-title"]}>Pagebox</div>
      <div>
        {/* Aplicando a classe de estilo ao botão */}
        <button className={styles.navButton} onClick={toggleDropdown}>
          Navegação
        </button>
        {dropdownOpen && (
          <ul className={styles.dropdown}>
            <li>
              <a className={styles.dropdownItem} href="/">
                Home
              </a>
            </li>
            <li>
              <a className={styles.dropdownItem} href="/detail/2">
                Detail
              </a>
            </li>
            <li>
              <a className={styles.dropdownItem} href="/path3">
                Caminho 3
              </a>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
