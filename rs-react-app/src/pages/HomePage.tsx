import { useCallback, useEffect, useState, type JSX } from 'react';
import styles from '../App.module.css';
import SearchBar from '../components/SearchBar/SearchBar';
import ErrorBoundary from '../ErrorBoundary';
import CardList from '../components/CardList/CardList';
import TestErrorButton from '../components/TestErrorButton/TestErrorButton';
import Header from '../components/Header/Header';
import fetchCharacters from '../api/rickAndMortyApi';
import type { Character } from '../types/types';

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

  const fetchData = useCallback(async (searchTerm: string, page: number = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await fetchCharacters(searchTerm, page);

      setSearchResults(results);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No characters found';

      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchData(lastSearchQuery, 1);
    };

    init();
  }, [lastSearchQuery, fetchData]);

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
  }, [lastSearchQuery, searchQuery]);

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

            <TestErrorButton isLoading={isLoading} />
          </ErrorBoundary>
        </section>
      </main>
    </>
  );
}
