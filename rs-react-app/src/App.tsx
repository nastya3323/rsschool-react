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

export interface AppState {
  searchQuery: string;
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
    searchQuery: '',
    searchResults: [],
    isLoading: false,
    error: null,
  };

  componentDidMount(): void {
    this.loadFirstPage();
  }

  public handleSearchInput = (query: string): void => {
    this.setState({ searchQuery: query });
  };

  private fetchData = async (url: string): Promise<void> => {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No characters found';
      this.setState({ error: errorMessage, isLoading: false, searchResults: [] });
    }
  };

  private loadFirstPage = async (): Promise<void> => {
    await this.fetchData('https://rickandmortyapi.com/api/character?page=1');
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
            <SearchBar searchQuery={searchQuery} onSearchInput={this.handleSearchInput} />
          </section>

          <section className={CLASSES.RESULTS}>
            <ErrorBoundary>
              <h2 className={CLASSES.RESULTS_TITLE}>Results ({searchResults.length})</h2>

              <CardList results={searchResults} error={error} isLoading={isLoading} />

              <TestErrorButton />
            </ErrorBoundary>
          </section>
        </main>
      </>
    );
  }
}

export default App;
