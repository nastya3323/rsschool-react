interface FileFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  onFileChange?: (file: File | null) => void;
  preview?: string | null;
  ref?: React.Ref<HTMLInputElement>;
}

export default function FileField({ id, label, error, onFileChange, preview, ref, ...props }: FileFieldProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange?.(file);
  };

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="file" ref={ref} onChange={handleChange} {...props} />

      {preview && <img src={preview} alt="Preview" className="preview" />}

      {error && <span className="error">{error}</span>}
    </div>
  );
}
