import { useCallback, useEffect, useState, type JSX } from 'react';
import styles from '../App.module.css';
import SearchBar from '../components/SearchBar/SearchBar';
import ErrorBoundary from '../ErrorBoundary';
import CardList from '../components/CardList/CardList';
import TestErrorButton from '../components/TestErrorButton/TestErrorButton';
import Header from '../components/Header/Header';
import { fetchCharacterById, fetchCharacters } from '../api/rickAndMortyApi';
import type { Character, Info } from '../types/types';
import Pagination from '../components/Pagination/Pagination';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../components/Spinner/Spinner';
import CardDetails from '../components/Card/CardDetails';
import useLocalStorage from '../hooks/useLocalStorage';

const CLASSES = {
  SEARCH: 'search',
};

const STORAGE_KEY = 'lastSearchQuery';

interface DetailsState {
  data: Character | null;
  isLoading: boolean;
  error: string | null;
}

export default function HomePage(): JSX.Element {
  const [lastSearchQuery, setLastSearchQuery] = useLocalStorage(STORAGE_KEY, '');
  const [searchQuery, setSearchQuery] = useState(lastSearchQuery);
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<Info>({ count: 0, pages: 0, next: null, prev: null });

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const detailsId = searchParams.get('details') ? Number(searchParams.get('details')) : null;

  const [detailsState, setDetailsState] = useState<DetailsState>({
    data: null,
    isLoading: false,
    error: null,
  });

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
      setPaginationInfo({ count: 0, pages: 0, next: null, prev: null });
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

  const handleSearch = useCallback(() => {
    const trimmed = searchQuery.trim();

    if (trimmed !== searchQuery) {
      setSearchQuery(trimmed);
    }

    if (trimmed === lastSearchQuery) {
      return;
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
  }, [lastSearchQuery, searchQuery, setSearchParams, setLastSearchQuery]);

  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
  };

  const loadDetails = useCallback(async (id: number) => {
    setDetailsState({ data: null, isLoading: true, error: null });

    try {
      const character = await fetchCharacterById(id);

      setDetailsState({ data: character, isLoading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load details';

      setDetailsState({ data: null, isLoading: false, error: errorMessage });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (detailsId) {
        await loadDetails(detailsId);
      } else {
        setDetailsState({ data: null, isLoading: false, error: null });
      }
    };

    init();
  }, [detailsId, loadDetails]);

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
        <section className={CLASSES.SEARCH}>
          <SearchBar
            searchQuery={searchQuery}
            onSearchInput={handleSearchInput}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </section>
        <ErrorBoundary>
          <section className={styles.results}>
            <div className={styles.leftColumn} onClick={closeDetails}>
              <h2 className={styles.results__title}>Results ({searchResults.length})</h2>

              <CardList results={searchResults} error={error} isLoading={isLoading} onCardClick={handleCardClick} />

              {!isLoading && <Pagination info={paginationInfo} />}

              <TestErrorButton isLoading={isLoading} />
            </div>
            <div className={styles.rightColumn}>
              {detailsState.isLoading && <Spinner />}
              {detailsState.error && <div className={styles.error}>{detailsState.error}</div>}
              {detailsState.data && !detailsState.isLoading && (
                <CardDetails character={detailsState.data} onClose={closeDetails} />
              )}
              {!detailsState.data && !detailsState.isLoading && !detailsState.error && (
                <div className={styles.noDetails}>Click on a character to see details</div>
              )}
            </div>
          </section>
        </ErrorBoundary>
      </main>
    </>
  );
}
