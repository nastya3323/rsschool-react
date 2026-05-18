import type { Character } from '../../types/types';
import styles from './Card.module.css';
import React, { type JSX } from 'react';

interface CardProps {
  character: Character;
  onClick: () => void;
}

export default function Card({ character, onClick }: CardProps): JSX.Element {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <div className={styles.cardItem} onClick={handleClick} data-testid="card">
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
