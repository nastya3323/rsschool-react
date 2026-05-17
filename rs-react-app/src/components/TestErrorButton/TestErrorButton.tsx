import styles from './TestErrorButton.module.css';
import { useState, type JSX } from 'react';
import Button from '../Button/Button';

const TEXT_ERROR = 'Test Error';

interface TestErrorButtonProps {
  isLoading: boolean;
}

export default function TestErrorButton({ isLoading }: TestErrorButtonProps): JSX.Element {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const handleErrorButtonClick = (): void => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error(TEXT_ERROR);
  }

  return (
    <Button className={styles.testErrorButton} onClick={handleErrorButtonClick} disabled={isLoading}>
      🔴 {TEXT_ERROR}
    </Button>
  );
}
