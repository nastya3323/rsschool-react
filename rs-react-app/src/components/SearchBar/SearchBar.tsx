import Button from '../Button/Button';
import './SearchBar.css';
import { Component, type JSX } from 'react';

const PLACEHOLDER__TEXT = 'Enter a character name, for example Luke';

const CLASSES = {
  SEARCH_BAR: 'search-bar',
  SEARCH_BAR_FIELD: 'search-bar__field',
  SEARCH_BAR_BUTTON: 'search-bar__button',
};

export default class SearchBar extends Component {
  render(): JSX.Element {
    return (
      <div className={CLASSES.SEARCH_BAR}>
        <input type="text" placeholder={PLACEHOLDER__TEXT} className={CLASSES.SEARCH_BAR_FIELD} />
        <Button className={CLASSES.SEARCH_BAR_BUTTON} onClick={() => console.log('Test')}>
          Find
        </Button>
      </div>
    );
  }
}
