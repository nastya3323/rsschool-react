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
};

export interface AppState {
  searchQuery: string;
  searchResults: [];
  isLoading: boolean;
  error: string | null;
}

class App extends Component {
  state: AppState = {
    searchQuery: '',
    searchResults: [],
    isLoading: false,
    error: null,
  };

  public handleSearchInput = (query: string): void => {
    this.setState({ searchQuery: query });
  };

  render() {
    const { searchQuery, searchResults } = this.state;

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
              <CardList results={searchResults} />
              <TestErrorButton />
            </ErrorBoundary>
          </section>
        </main>
      </>
    );
  }
}

export default App;
