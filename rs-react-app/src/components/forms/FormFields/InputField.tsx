interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export default function InputField({ id, label, error, ref, ...props }: InputFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} ref={ref} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
