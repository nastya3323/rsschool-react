interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export default function CheckboxField({ id, label, error, ref, ...props }: CheckboxFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>
        <input id={id} type="checkbox" ref={ref} {...props} /> {label}
      </label>
      {error && <span className="error">{error}</span>}
    </div>
  );
}
