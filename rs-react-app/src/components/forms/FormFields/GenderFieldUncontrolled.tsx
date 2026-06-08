interface Option {
  value: string;
  label: string;
}

interface GenderFieldProps {
  label: string;
  options: Option[];
  error?: string;
  name: string;
  defaultValue?: string;
}

export default function GenderFieldUncontrolled({ label, options, error, name, defaultValue }: GenderFieldProps) {
  return (
    <fieldset className="field">
      <legend className="gender-legend">{label}</legend>
      {options.map((opt) => (
        <label key={opt.value} className="gender-option">
          <input type="radio" name={name} value={opt.value} defaultChecked={opt.value === defaultValue} />
          {opt.label}
        </label>
      ))}
      {error && <span className="error">{error}</span>}
    </fieldset>
  );
}
