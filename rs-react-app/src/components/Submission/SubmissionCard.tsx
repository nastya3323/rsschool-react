import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Submission } from '../../types';
import { clearHighlight } from '../../store/slices/submissionsSlice';
import styles from './Submission.module.css';

interface SubmissionCardProps {
  submission: Submission;
}

export default function SubmissionCard({ submission }: SubmissionCardProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (submission.highlighted) {
      const timer = setTimeout(() => {
        dispatch(clearHighlight(submission.id));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submission.id, submission.highlighted, dispatch]);

  const cardClass = `${styles.card} ${submission.highlighted ? styles.highlighted : ''}`;

  return (
    <div className={cardClass}>
      <img src={submission.imageBase64} alt="User" className={styles.cardImage} />

      <p>
        <strong>Name:</strong> {submission.name}
      </p>
      <p>
        <strong>Age:</strong> {submission.age}
      </p>
      <p>
        <strong>Email:</strong> {submission.email}
      </p>
      <p>
        <strong>Gender:</strong> {submission.gender}
      </p>
      <p>
        <strong>Accepted:</strong> {submission.terms ? 'Yes' : 'No'}
      </p>
      <p>
        <strong>Password:</strong> {submission.password}
      </p>
      <p>
        <strong>Country:</strong> {submission.country}
      </p>

      <p className={styles.submittedAt}>Sent at: {new Date(submission.submittedAt).toLocaleString()}</p>
    </div>
  );
}
