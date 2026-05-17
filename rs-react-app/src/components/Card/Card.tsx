import styles from './Card.module.css';
import type { Character } from '../../App';
import { type JSX } from 'react';

interface CardProps {
  character: Character;
}

export default function Card({ character }: CardProps): JSX.Element {
  return (
    <div className={styles.cardItem}>
      <h3 className={styles.cardItem__title}>
        <span>Name</span>: {character.name}
      </h3>
      <p className={styles.cardItem__description}>
        <span>Status</span>: {character.status}
      </p>
      <p className={styles.cardItem__description}>
        <span>Gender</span>: {character.gender}
      </p>
      <p className={styles.cardItem__description}>
        <span>Species</span>: {character.species}
      </p>
      <p className={styles.cardItem__description}>
        <span>Location</span>: {character.location.name}
      </p>
    </div>
  );
}
