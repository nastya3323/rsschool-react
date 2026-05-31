import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import styles from './FloatingActionBar.module.css';
import { clearAll } from '../../store/selectedSlice';
import { downloadSelectedCharacters } from '../../utils/csvExport';
import { selectSelectedIds } from '../../store/selectedSelectors';
import { useLazyGetCharactersByIdsQuery } from '../../api/rickAndMortyApi';
import { useEffect } from 'react';

export default function FloatingActionBar() {
  const selectedIds = useSelector(selectSelectedIds);

  const dispatch = useDispatch();
  const count = selectedIds.length;

  const [trigger, { data: characters, error, isFetching }] = useLazyGetCharactersByIdsQuery();

  const handleClearAll = () => {
    dispatch(clearAll());
  };

  const handleDownload = async () => {
    if (!count) {
      return;
    }

    trigger(selectedIds);
  };

  useEffect(() => {
    if (characters) {
      downloadSelectedCharacters(characters);
    }
  }, [characters]);

  if (!count) {
    return null;
  }

  return (
    <div className={styles.floatingBar}>
      <div className={styles.floatingBar__content}>
        <div className={styles.floatingBar__info}>
          Selected: {count} character{count !== 1 ? 's' : ''}
        </div>
        {error ? (
          <p className={styles.floatingBar__error}>Could not download selected characters. Please try again.</p>
        ) : (
          ''
        )}
        <div className={styles.floatingBar__actions}>
          <Button className={styles.floatingBar__button} onClick={handleClearAll}>
            Clear All
          </Button>
          <Button className={styles.floatingBar__button} onClick={handleDownload} disabled={isFetching}>
            {isFetching ? 'Loading...' : 'Download'}
          </Button>
        </div>
      </div>
    </div>
  );
}
