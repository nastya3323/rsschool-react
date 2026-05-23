import type { JSX } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

export default function Header(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>🧪 Rick and Morty character search</h1>
      <Link to="/about" className={styles.header__link}>
        About
      </Link>
      <button onClick={toggleTheme} className={styles.themeToggle}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
