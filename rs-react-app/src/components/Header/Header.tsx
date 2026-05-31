import type { JSX } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useDispatch } from 'react-redux';
import { rickAndMortyApi } from '../../api/rickAndMortyApi';
import Button from '../Button/Button';

export default function Header(): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(rickAndMortyApi.util.invalidateTags(['Characters', 'Character']));
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>🧪 Rick and Morty character search</h1>
      <Link className={styles.header__link} to="/about">
        About
      </Link>
      <Button className={styles.header__refreshButton} onClick={handleRefresh}>
        ⟳ Refresh
      </Button>
      <button className={styles.header__themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
