import Button from '../Button/Button';
import styles from './SearchBar.module.css';
import { Component, type ChangeEvent, type JSX, type KeyboardEvent } from 'react';

const PLACEHOLDER__TEXT = 'Enter a character name, for example Rick';

interface SearchBarProps {
  searchQuery: string;
  onSearchInput: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export default class SearchBar extends Component<SearchBarProps> {
  private handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.props.onSearchInput(event.target.value);
  };

  private handleButtonClick = (): void => {
    this.props.onSearch();
  };

  private handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      this.props.onSearch();
    }
  };

  render(): JSX.Element {
    const { searchQuery, isLoading } = this.props;

    return (
      <div className={styles.searchBar}>
        <input
          className={styles.searchBar__field}
          type="text"
          placeholder={PLACEHOLDER__TEXT}
          value={searchQuery}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          disabled={isLoading}
        />
        <Button className={styles.searchBar__button} onClick={this.handleButtonClick} disabled={isLoading}>
          {isLoading ? 'Search...' : 'Find'}
        </Button>
      </div>
    );
  }
}
