import { render, screen } from '@testing-library/react';
import PasswordField from '../components/forms/FormFields/PasswordField';

describe('PasswordField component', () => {
  it('renders password input', () => {
    render(<PasswordField id="pass" label="Password" />);

    const input = screen.getByLabelText('Password');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows error', () => {
    render(<PasswordField id="pass" label="Password" error="Too short" />);

    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('renders PasswordStrength when strength array is not empty', () => {
    const checks = ['1 digit', '1 uppercase'];

    render(<PasswordField id="pass" label="Password" strength={checks} />);

    expect(screen.getByText(/Password strength:/)).toBeInTheDocument();
  });

  it('does not show PasswordStrength when strength is empty', () => {
    render(<PasswordField id="pass" label="Password" strength={[]} />);

    expect(screen.queryByText(/Password strength:/)).not.toBeInTheDocument();
  });
});
