import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import styles from './FloatingActionBar.module.css';
import type { RootState } from '../../store/store';
import { clearAll } from '../../store/selectedSlice';

export default function FloatingActionBar() {
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

  return (
    <div className={styles.floatingBar}>
      <div className={styles.floatingBar__content}>
        <div className={styles.floatingBar__info}>
          Selected: {count} character{count !== 1 ? 's' : ''}
        </div>
        <div className={styles.floatingBar__actions}>
          <Button className={styles.floatingBar__button} onClick={handleClearAll}>
            Clear All
          </Button>
          <Button className={styles.floatingBar__button} onClick={() => console.log('Download')}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
