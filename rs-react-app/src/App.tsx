import { Component } from 'react';
import './App.css';
import CardList from './components/CardList/CardList';
import SearchBar from './components/SearchBar/SearchBar';
import TestErrorButton from './components/TestErrorButton/TestErrorButton';
import ErrorBoundary from './ErrorBoundary';

const CLASSES = {
  TITLE: 'title',
  MAIN: 'main',
  SEARCH: 'search',
  RESULTS: 'results',
  RESULTS_TITLE: 'results__title',
};

const STORAGE_KEY = 'lastSearchQuery';

export interface AppState {
  searchQuery: string;
  lastExecutedQuery: string;
  searchResults: [];
  isLoading: boolean;
  error: string | null;
}

export interface Character {
  id: number;
  name: string;
  gender: string;
  species: string;
  status: string;
  location: {
    name: string;
  };
}

class App extends Component {
  state: AppState = {
    searchQuery: localStorage.getItem(STORAGE_KEY) || '',
    lastExecutedQuery: '',
    searchResults: [],
    isLoading: false,
    error: null,
  };

  componentDidMount(): void {
    const { searchQuery } = this.state;

    if (searchQuery.trim()) {
      this.performSearch();
    } else {
      this.loadFirstPage();
    }
  }

  public handleSearchInput = (query: string): void => {
    this.setState({ searchQuery: query, error: null });
  };

  private fetchData = async (url: string, isSearch: boolean = false): Promise<void> => {
    this.setState({ isLoading: true, error: null });

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No characters found');
        }
        throw new Error(`API error (${response.status})`);
      }

      const data = await response.json();

      if (data.results.length === 0) {
        throw new Error('No characters found');
      }

      this.setState({ searchResults: data.results, isLoading: false });

      if (isSearch) {
        const trimmed = this.state.searchQuery.trim();
        this.setState({ lastExecutedQuery: trimmed });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No characters found';
      this.setState({ lastExecutedQuery: '', error: errorMessage, isLoading: false, searchResults: [] });
    }
  };

  private loadFirstPage = async (): Promise<void> => {
    await this.fetchData('https://rickandmortyapi.com/api/character?page=1');
  };

  public performSearch = async (): Promise<void> => {
    const { searchQuery, lastExecutedQuery, isLoading } = this.state;

    if (isLoading) {
      return;
    }

    const trimmed = searchQuery.trim();

    if (trimmed !== searchQuery) {
      this.setState({ searchQuery: trimmed });
    }

    if (trimmed === '') {
      localStorage.removeItem(STORAGE_KEY);
      this.setState({ lastExecutedQuery: '', error: null });
      await this.loadFirstPage();
      return;
    }

    if (trimmed === lastExecutedQuery) {
      return;
    }

    const url = `https://rickandmortyapi.com/api/character/?name=${trimmed}&page=1`;

    await this.fetchData(url, true);

    localStorage.setItem(STORAGE_KEY, trimmed);
  };

  render() {
    const { searchQuery, searchResults, error, isLoading } = this.state;

    return (
      <>
        <header>
          <h1 className={CLASSES.TITLE}>🧪 Rick and Morty character search</h1>
        </header>
        <main className={CLASSES.MAIN}>
          <section className={CLASSES.SEARCH}>
            <SearchBar
              searchQuery={searchQuery}
              onSearchInput={this.handleSearchInput}
              onSearch={this.performSearch}
              isLoading={isLoading}
            />
          </section>

          <section className={CLASSES.RESULTS}>
            <ErrorBoundary>
              <h2 className={CLASSES.RESULTS_TITLE}>Results ({searchResults.length})</h2>

              <CardList results={searchResults} error={error} isLoading={isLoading} />

              <TestErrorButton isLoading={isLoading} />
            </ErrorBoundary>
          </section>
        </main>
      </>
    );
  }
}

export default App;
