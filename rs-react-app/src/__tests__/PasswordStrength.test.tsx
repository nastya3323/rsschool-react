import { render, screen } from '@testing-library/react';
import PasswordStrength from '../components/forms/FormFields/PasswordStrength';

describe('PasswordStrength component', () => {
  it('displays "strong" for 4 checks', () => {
    const checks = ['1 digit', '1 uppercase', '1 lowercase', '1 special char'];

    render(<PasswordStrength checks={checks} />);

    const strongText = screen.getByText('strong');

    expect(strongText).toBeInTheDocument();
    expect(strongText).toHaveStyle('color: rgb(0, 128, 0)');
  });

  it('displays "average" for 3 checks', () => {
    const checks = ['1 digit', '1 uppercase', '1 lowercase'];

    render(<PasswordStrength checks={checks} />);

    const averageText = screen.getByText('average');

    expect(averageText).toBeInTheDocument();
    expect(averageText).toHaveStyle('color: rgb(255, 255, 0)');
  });

  it('displays "weak" for 2 or less checks', () => {
    const checks = ['1 digit'];

    render(<PasswordStrength checks={checks} />);

    const weakText = screen.getByText('weak');

    expect(weakText).toBeInTheDocument();
    expect(weakText).toHaveStyle('color: rgb(255, 0, 0)');
  });
});
