import styles from './Pagination.module.css';
import Button from '../Button/Button';
import { useSearchParams } from 'react-router-dom';
import type { JSX } from 'react';

interface PaginationProps {
  prev: string | null;
  next: string | null;
  pages: number;
}

export default function Pagination({ prev, next, pages }: PaginationProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

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
      <Button className={styles.pagination__button} onClick={(event) => handleChangePage(event, prev)} disabled={!prev}>
        Prev
      </Button>
      <div className={styles.pagination__count}>
        {currentPage} / {pages}
      </div>
      <Button className={styles.pagination__button} onClick={(event) => handleChangePage(event, next)} disabled={!next}>
        Next
      </Button>
    </div>
  );
}
