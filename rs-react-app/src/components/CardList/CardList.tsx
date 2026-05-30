import styles from './CardList.module.css';
import { type JSX } from 'react';
import Card from '../Card/Card';
import type { Character } from '../../types/types';
import Spinner from '../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSelect } from '../../store/selectedSlice';
import { selectSelectedIds } from '../../store/selectedSelectors';

interface CardListProps {
  results: Character[];
  error: string | null;
  isLoading: boolean;
  onCardClick: (id: number) => void;
}

export default function CardList({ results, error, isLoading, onCardClick }: CardListProps): JSX.Element {
  const selectedIds = useSelector(selectSelectedIds);

  const dispatch = useDispatch();

  const handleSelect = (id: number) => {
    dispatch(toggleSelect(id));
  };

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
          return (
            <Card
              key={character.id}
              character={character}
              isSelected={selectedIds.includes(character.id)}
              onOpenDetails={() => onCardClick(character.id)}
              onSelect={handleSelect}
            />
          );
        })}
      </div>
    </>
  );
}
