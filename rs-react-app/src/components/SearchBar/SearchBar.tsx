import Button from '../Button/Button';
import './SearchBar.css';
import { Component, type ChangeEvent, type JSX } from 'react';

const PLACEHOLDER__TEXT = 'Enter a character name, for example Rick';

const CLASSES = {
  SEARCH_BAR: 'search-bar',
  SEARCH_BAR_FIELD: 'search-bar__field',
  SEARCH_BAR_BUTTON: 'search-bar__button',
};

interface SearchBarProps {
  searchQuery: string;
  onSearchInput: (query: string) => void;
}

export default class SearchBar extends Component<SearchBarProps> {
  private handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.props.onSearchInput(event.target.value);
  };

  render(): JSX.Element {
    const { searchQuery } = this.props;

    return (
      <div className={CLASSES.SEARCH_BAR}>
        <input
          className={CLASSES.SEARCH_BAR_FIELD}
          type="text"
          placeholder={PLACEHOLDER__TEXT}
          value={searchQuery}
          onChange={this.handleInputChange}
        />
        <Button className={CLASSES.SEARCH_BAR_BUTTON} onClick={() => console.log('Test')}>
          Find
        </Button>
      </div>
    );
  }
}
