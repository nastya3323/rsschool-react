import { useCallback, useEffect, useState } from 'react';
import type { Character } from '../../types/types';
import Button from '../Button/Button';
import styles from './CardDetails.module.css';
import { fetchCharacterById } from '../../api/rickAndMortyApi';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

export default function CardDetails() {
  const [searchParams, setSearchParams] = useSearchParams();

  const detailsId = searchParams.get('details') ? Number(searchParams.get('details')) : null;

  const [character, setCharacter] = useState<Character | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const character = await fetchCharacterById(id);

      setCharacter(character);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load details';

      setCharacter(null);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (detailsId) {
        await loadDetails(detailsId);
      } else {
        setCharacter(null);
        setIsLoading(false);
        setError(null);
      }
    };

    init();
  }, [detailsId, loadDetails]);

  const closeDetails = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete('details');
      return params;
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!character && !isLoading && !error) {
    return <div className={styles.noDetails}>Click on a character to see details</div>;
  }

  return (
    <>
      {character && (
        <div className={styles.details}>
          <div className={styles.details__header}>
            <h3>Character Details</h3>
            <Button className={styles.details__closeBtn} onClick={closeDetails}>
              ✕
            </Button>
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
      )}
    </>
  );
}
