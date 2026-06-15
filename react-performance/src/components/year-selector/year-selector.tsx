import { memo, useMemo } from 'react';
import styles from './year-selector.module.css';

type YearSelectorProps = {
  year: number;
  years: number[];
  onChange: (year: number) => void;
};

export const YearSelector = memo(({ year, years, onChange }: YearSelectorProps) => {
  const options = useMemo(() => {
    return years.map((year) => {
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    });
  }, [years]);

  return (
    <div className={styles.container}>
      <label htmlFor="year" className={styles.label}>
        Select year:
      </label>
      <select
        id="year"
        value={year}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.select}
      >
        {options}
      </select>
    </div>
  );
});
