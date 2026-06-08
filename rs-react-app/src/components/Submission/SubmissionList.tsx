import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import SubmissionCard from './SubmissionCard';
import styles from './Submission.module.css';

export default function SubmissionList() {
  const submissions = useSelector((state: RootState) => {
    return state.submissions.items;
  });

  const sorted = [...submissions].sort((a, b) => b.submittedAt - a.submittedAt);

  return (
    <section className={styles.cards}>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        sorted.map((item) => {
          return <SubmissionCard key={item.id} submission={item} />;
        })
      )}
    </section>
  );
}
