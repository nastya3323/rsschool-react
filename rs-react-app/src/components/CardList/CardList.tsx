import './CardList.css';
import { Component, type JSX } from 'react';
import Card from '../Card/Card';
import type { Character } from '../../App';

const CLASSES = {
  RESULTS_LIST: 'results__list',
  ERROR_MESSAGE: 'error-message',
};

interface CardListProps {
  results: Character[];
  error: string | null;
  isLoading: boolean;
}

export default class CardList extends Component<CardListProps> {
  render(): JSX.Element {
    const { results, error } = this.props;

    if (error) {
      return <div className={CLASSES.ERROR_MESSAGE}>{error}</div>;
    }

    return (
      <>
        <div className={CLASSES.RESULTS_LIST}>
          {results.map((character) => {
            return <Card key={character.id} character={character} />;
          })}
        </div>
      </>
    );
  }
}
