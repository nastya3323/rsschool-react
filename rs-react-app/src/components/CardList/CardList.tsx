import styles from './CardList.module.css';
import { type JSX } from 'react';
import Card from '../Card/Card';
import type { Character } from '../../types/types';
import Spinner from '../Spinner/Spinner';

interface CardListProps {
  results: Character[];
  error: string | null;
  isLoading: boolean;
  onCardClick: (id: number) => void;
}

export default function CardList({ results, error, isLoading, onCardClick }: CardListProps): JSX.Element {
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
          return <Card key={character.id} character={character} onClick={() => onCardClick(character.id)} />;
        })}
      </div>
    </>
  );
}
