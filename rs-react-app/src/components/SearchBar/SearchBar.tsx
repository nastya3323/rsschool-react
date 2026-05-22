import Button from '../Button/Button';
import styles from './SearchBar.module.css';
import { type ChangeEvent, type JSX, type KeyboardEvent } from 'react';

const PLACEHOLDER__TEXT = 'Enter a character name, for example Rick';

interface SearchBarProps {
  searchQuery: string;
  onSearchInput: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export default function SearchBar({ searchQuery, onSearchInput, onSearch, isLoading }: SearchBarProps): JSX.Element {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onSearchInput(event.target.value);
  };

  const handleButtonClick = (): void => {
    onSearch();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchBar__field}
        type="text"
        placeholder={PLACEHOLDER__TEXT}
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <Button className={styles.searchBar__button} onClick={handleButtonClick} disabled={isLoading}>
        {isLoading ? 'Search...' : 'Find'}
      </Button>
    </div>
  );
}
