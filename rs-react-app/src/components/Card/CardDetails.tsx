import type { Character } from '../../types/types';
import Button from '../Button/Button';
import styles from './CardDetails.module.css';

interface CardDetailsProps {
  character: Character;
  onClose: () => void;
}

export default function CardDetails({ character, onClose }: CardDetailsProps) {
  return (
    <div className={styles.details}>
      <div className={styles.details__header}>
        <h3>Character Details</h3>
        <Button onClick={onClose}>✕</Button>
      </div>
      <div className={styles.details__content}>
        <img className={styles.details__image} src={character.image} alt={character.name} />
        <h3 className={styles.details__title}>{character.name}</h3>
        <p className={styles.details__description}>
          <span>Status</span>: {character.status}
        </p>
        <p className={styles.details__description}>
          <span>Gender</span>: {character.gender}
        </p>
        <p className={styles.details__description}>
          <span>Species</span>: {character.species}
        </p>
        <p className={styles.details__description}>
          <span>Location</span>: {character.location.name}
        </p>
      </div>
    </div>
  );
}
