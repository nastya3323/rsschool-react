import { Component, type JSX, type MouseEventHandler, type ReactNode } from 'react';

const CLASS = 'button';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default class Button extends Component<ButtonProps> {
  render(): JSX.Element {
    const { children, className = '', disabled, onClick } = this.props;

    return (
      <button className={`${CLASS} ${className}`} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );
  }
}
