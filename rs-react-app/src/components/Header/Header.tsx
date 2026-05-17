import type { JSX } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>🧪 Rick and Morty character search</h1>
      <Link to="/about" className={styles.header__link}>
        About
      </Link>
    </header>
  );
}
