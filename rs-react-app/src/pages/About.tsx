import { Link } from 'react-router-dom';
import styles from './About.module.css';
import type { JSX } from 'react';

export default function About(): JSX.Element {
  return (
    <div className={styles.about}>
      <div className={styles.about__container}>
        <h2 className={styles.about__title}>About Rick and Morty character search</h2>
        <p className={styles.about__description}>
          This application allows you to search for characters from the Rick and Morty universe. You can browse through
          pages and see character details such as status, species, gender, and location.
        </p>
        <p className={styles.about__description}>
          Data is provided by{' '}
          <a
            className={styles.about__link}
            href="https://rickandmortyapi.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rick and Morty API
          </a>
          .
        </p>
        <h3 className={styles.about__subtitle}>Features:</h3>
        <ul className={styles.about__items}>
          <li className={styles.about__item}>Search by character name</li>
          <li className={styles.about__item}>Pagination with URL sync</li>
          <li className={styles.about__item}>Error boundary for runtime errors</li>
        </ul>

        <p className={styles.about__author}>🛠️ Created by an RSSchool student as part of the React 2026 Q2 course</p>

        <div className={styles.about__links}>
          <a
            className={styles.about__link}
            href="https://github.com/nastya3323"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className={styles.about__link}
            href="https://rs.school/ru/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
          >
            RS School React Course
          </a>
        </div>
        <Link to="/" className={styles.about__back}>
          Back
        </Link>
      </div>
    </div>
  );
}
