import { type JSX, type MouseEventHandler, type ReactNode } from 'react';

const CLASS = 'button';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ children, className = '', disabled, onClick }: ButtonProps): JSX.Element {
  return (
    <button className={`${CLASS} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
