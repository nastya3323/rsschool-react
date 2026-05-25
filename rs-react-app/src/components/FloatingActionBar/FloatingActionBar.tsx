import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import styles from './FloatingActionBar.module.css';
import type { RootState } from '../../store/store';
import { clearAll } from '../../store/selectedSlice';
import { downloadSelectedCharacters } from '../../utils/csvExport';
import { useState } from 'react';
import { fetchCharactersByIds } from '../../api/rickAndMortyApi';

export default function FloatingActionBar() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isError, setIsError] = useState(false);

  const selectedIds = useSelector((state: RootState) => {
    return state.selected.ids;
  });

  const dispatch = useDispatch();
  const count = selectedIds.length;

  if (!count) {
    return null;
  }

  const handleClearAll = () => {
    dispatch(clearAll());
  };

  const handleDownload = async () => {
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);
    setIsError(false);

    try {
      const characters = await fetchCharactersByIds(selectedIds);
      downloadSelectedCharacters(characters);
    } catch {
      setIsError(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.floatingBar}>
      <div className={styles.floatingBar__content}>
        <div className={styles.floatingBar__info}>
          Selected: {count} character{count !== 1 ? 's' : ''}
        </div>
        {isError ? (
          <p className={styles.floatingBar__error}>Could not download selected characters. Please try again.</p>
        ) : (
          ''
        )}
        <div className={styles.floatingBar__actions}>
          <Button className={styles.floatingBar__button} onClick={handleClearAll}>
            Clear All
          </Button>
          <Button className={styles.floatingBar__button} onClick={handleDownload}>
            {isDownloading ? 'Loading...' : 'Download'}
          </Button>
        </div>
      </div>
    </div>
  );
}
