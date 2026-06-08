import type { ChangeEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface GenderFieldProps {
  id: string;
  label: string;
  options: Option[];
  error?: string;
  selectedValue?: string;
  onChange?: (value: string) => void;
}

export default function GenderFieldControlled({
  id,
  label,
  options,
  error,
  selectedValue,
  onChange,
}: GenderFieldProps) {
  return (
    <fieldset className="field">
      <legend className="gender-legend">{label}</legend>
      {options.map((opt) => (
        <label key={opt.value} className="gender-option">
          <input
            type="radio"
            name={id}
            value={opt.value}
            checked={selectedValue === opt.value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange?.(event.target.value);
            }}
          />
          {opt.label}
        </label>
      ))}
      {error && <span className="error">{error}</span>}
    </fieldset>
  );
}
