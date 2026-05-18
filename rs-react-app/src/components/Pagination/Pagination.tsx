import styles from './Pagination.module.css';
import Button from '../Button/Button';
import type { Info } from '../../types/types';
import { useSearchParams } from 'react-router-dom';
import type { JSX } from 'react';

interface PaginationProps {
  info: Info;
}

export default function Pagination({ info }: PaginationProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { prev, next, pages } = info;

  const handleChangePage = (event: React.MouseEvent, url: string | null) => {
    event.stopPropagation();

    if (!url) {
      return;
    }

    const page = new URL(url).searchParams.get('page');

    if (page) {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set('page', String(page));
        return params;
      });
    }
  };

  return (
    <div className={styles.pagination}>
      <Button
        className={styles.pagination__button}
        onClick={(event) => handleChangePage(event, prev)}
        disabled={!info.prev}
      >
        Prev
      </Button>
      <div className={styles.pagination__count}>
        {currentPage} / {pages}
      </div>
      <Button
        className={styles.pagination__button}
        onClick={(event) => handleChangePage(event, next)}
        disabled={!info.next}
      >
        Next
      </Button>
    </div>
  );
}
