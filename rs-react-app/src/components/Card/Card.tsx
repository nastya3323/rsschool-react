import type { Character } from '../../types/types';
import styles from './Card.module.css';
import React, { type JSX } from 'react';

interface CardProps {
  character: Character;
  isSelected: boolean;
  onOpenDetails: () => void;
  onSelect: (id: number) => void;
}

export default function Card({ character, onOpenDetails, isSelected, onSelect }: CardProps): JSX.Element {
  const handleCardClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onOpenDetails();
  };

  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect(character.id);
  };

  return (
    <div className={styles.cardItem} onClick={handleCardClick} data-testid="card">
      <div className={styles.cardItem__checkbox}>
        <input type="checkbox" checked={isSelected} onClick={handleCheckboxClick} onChange={() => {}} />
      </div>
      <h3 className={styles.cardItem__title}>
        <span>Name</span>: {character.name}
      </h3>
      <p className={styles.cardItem__description}>
        <span>Status</span>: {character.status}
      </p>
      <p className={styles.cardItem__description}>
        <span>Species</span>: {character.species}
      </p>
    </div>
  );
}
