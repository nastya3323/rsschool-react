import styles from './Spinner.module.css';
import { type JSX } from 'react';

export default function Spinner(): JSX.Element {
  return <div className={styles.spinner} data-testid="spinner"></div>;
}
