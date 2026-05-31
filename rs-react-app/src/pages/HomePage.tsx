import { useCallback, useEffect, useState, type JSX } from 'react';
import styles from '../App.module.css';
import SearchBar from '../components/SearchBar/SearchBar';
import ErrorBoundary from '../ErrorBoundary';
import CardList from '../components/CardList/CardList';
import TestErrorButton from '../components/TestErrorButton/TestErrorButton';
import Header from '../components/Header/Header';
import Pagination from '../components/Pagination/Pagination';
import { Outlet, useSearchParams } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import FloatingActionBar from '../components/FloatingActionBar/FloatingActionBar';
import { useGetCharactersQuery } from '../api/rickAndMortyApi';

const STORAGE_KEY = 'lastSearchQuery';

export default function HomePage(): JSX.Element {
  const [lastSearchQuery, setLastSearchQuery] = useLocalStorage(STORAGE_KEY, '');
  const [searchQuery, setSearchQuery] = useState(lastSearchQuery);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const { data, error, isFetching } = useGetCharactersQuery({
    searchTerm: lastSearchQuery,
    page,
  });

  const searchResults = data?.results || [];
  const paginationInfo = data?.info || { count: 0, pages: 0, next: null, prev: null };
  const loading = isFetching;
  const errorMessage = error ? (typeof error === 'string' ? error : 'Something went wrong') : null;

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({ page: '1' });
    }
  }, [searchParams, setSearchParams]);

  const handleSearch = useCallback(() => {
    const trimmed = searchQuery.trim();

    if (trimmed !== searchQuery) {
      setSearchQuery(trimmed);
    }

    setLastSearchQuery(trimmed);

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', '1');

      if (params.has('details')) {
        params.delete('details');
      }

      return params;
    });
  }, [searchQuery, setSearchParams, setLastSearchQuery]);

  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
  };

  const handleCardClick = (id: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('details', String(id));
      return params;
    });
  };

  const closeDetails = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete('details');
      return params;
    });
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section>
          <SearchBar
            searchQuery={searchQuery}
            onSearchInput={handleSearchInput}
            onSearch={handleSearch}
            isLoading={loading}
          />
        </section>
        <ErrorBoundary>
          <section className={styles.results}>
            <div className={styles.leftColumn} onClick={closeDetails} data-testid="left-column">
              <h2 className={styles.results__title}>Results ({searchResults.length})</h2>

              <CardList
                results={searchResults}
                error={errorMessage}
                isLoading={loading}
                onCardClick={handleCardClick}
              />

              {!loading && <Pagination {...paginationInfo} />}

              <TestErrorButton isLoading={loading} />
            </div>
            <div className={styles.rightColumn}>
              <Outlet />
            </div>
          </section>
          <FloatingActionBar />
        </ErrorBoundary>
      </main>
    </>
  );
}
