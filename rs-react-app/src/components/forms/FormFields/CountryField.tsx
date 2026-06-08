interface Option {
  name: string;
  code: string;
}

interface CountryField extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  options: Option[];
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export default function CountryField({ id, label, options, error, ref, ...props }: CountryField) {
  const listId = `${id}-list`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" list={listId} placeholder="Start typing..." ref={ref} {...props} />
      <datalist id={listId}>
        {options.map((country) => (
          <option key={country.code} value={country.name} />
        ))}
      </datalist>
      {error && <span className="error">{error}</span>}
    </div>
  );
}
