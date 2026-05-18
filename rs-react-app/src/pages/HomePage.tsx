import { useCallback, useEffect, useState, type JSX } from 'react';
import styles from '../App.module.css';
import SearchBar from '../components/SearchBar/SearchBar';
import ErrorBoundary from '../ErrorBoundary';
import CardList from '../components/CardList/CardList';
import TestErrorButton from '../components/TestErrorButton/TestErrorButton';
import Header from '../components/Header/Header';
import fetchCharacters from '../api/rickAndMortyApi';
import type { Character, Info } from '../types/types';
import Pagination from '../components/Pagination/Pagination';
import { useSearchParams } from 'react-router-dom';

const CLASSES = {
  SEARCH: 'search',
};

const STORAGE_KEY = 'lastSearchQuery';

export default function HomePage(): JSX.Element {
  const [lastSearchQuery, setLastSearchQuery] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [searchQuery, setSearchQuery] = useState(lastSearchQuery);
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<Info>({ count: 0, pages: 0, next: null, prev: null });

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const fetchData = useCallback(async (searchTerm: string, page: number = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const { results, info } = await fetchCharacters(searchTerm, page);

      setSearchResults(results);
      setPaginationInfo(info);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No characters found';

      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({ page: '1' });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const init = async () => {
      await fetchData(lastSearchQuery, page);
    };

    init();
  }, [lastSearchQuery, fetchData, page]);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage !== page) {
        setSearchParams((prev) => {
          const params = new URLSearchParams(prev);
          params.set('page', String(newPage));
          return params;
        });
      }
    },
    [setSearchParams, page]
  );

  const handleSearch = useCallback(() => {
    const trimmed = searchQuery.trim();

    if (trimmed !== searchQuery) {
      setSearchQuery(trimmed);
    }

    if (trimmed === lastSearchQuery) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, trimmed);
    setLastSearchQuery(trimmed);
    goToPage(1);
  }, [lastSearchQuery, searchQuery, goToPage]);

  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={CLASSES.SEARCH}>
          <SearchBar
            searchQuery={searchQuery}
            onSearchInput={handleSearchInput}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </section>

        <section className={styles.results}>
          <ErrorBoundary>
            <h2 className={styles.results__title}>Results ({searchResults.length})</h2>

            <CardList results={searchResults} error={error} isLoading={isLoading} />

            {!isLoading && <Pagination info={paginationInfo} />}

            <TestErrorButton isLoading={isLoading} />
          </ErrorBoundary>
        </section>
      </main>
    </>
  );
}
