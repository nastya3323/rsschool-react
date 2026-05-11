import styles from './CardList.module.css';
import { Component, type JSX } from 'react';
import Card from '../Card/Card';
import type { Character } from '../../App';
import Spinner from '../Spinner/Spinner';

interface CardListProps {
  results: Character[];
  error: string | null;
  isLoading: boolean;
}

export default class CardList extends Component<CardListProps> {
  render(): JSX.Element {
    const { results, error, isLoading } = this.props;

    if (error) {
      return <div className={styles.errorMessage}>{error}</div>;
    }

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <>
        <div className={styles.results__list} data-testid="card-list">
          {results.map((character) => {
            return <Card key={character.id} character={character} />;
          })}
        </div>
      </>
    );
  }
}
