import Button from '../Button/Button';
import styles from './CardDetails.module.css';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { useGetCharacterByIdQuery } from '../../api/rickAndMortyApi';

export default function CardDetails() {
  const [searchParams, setSearchParams] = useSearchParams();

  const detailsId = searchParams.get('details') ? Number(searchParams.get('details')) : null;

  const {
    data: character,
    error,
    isFetching,
  } = useGetCharacterByIdQuery(detailsId!, {
    skip: !detailsId,
  });

  const closeDetails = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete('details');
      return params;
    });
  };

  if (!detailsId) {
    return <div className={styles.noDetails}>Click on a character to see details</div>;
  }

  if (isFetching) {
    return <Spinner />;
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : 'Failed to load details';
    return <div className={styles.error}>{errorMessage}</div>;
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
