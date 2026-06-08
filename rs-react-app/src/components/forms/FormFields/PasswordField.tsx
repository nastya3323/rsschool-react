import React from 'react';
import PasswordStrength from './PasswordStrength';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  strength?: string[];
  ref?: React.Ref<HTMLInputElement>;
}

export default function PasswordField({ id, label, error, strength, ref, ...props }: PasswordFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="password" ref={ref} {...props} />
      {strength && strength.length > 0 && <PasswordStrength checks={strength} />}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
