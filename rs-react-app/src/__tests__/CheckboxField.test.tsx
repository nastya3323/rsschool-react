import { render, screen } from '@testing-library/react';
import CheckboxField from '../components/forms/FormFields/CheckboxField';
import userEvent from '@testing-library/user-event';

describe('CheckboxField component', () => {
  it('renders with label and checkbox', () => {
    render(<CheckboxField id="terms" label="Accept Terms" />);

    const checkbox = screen.getByLabelText('Accept Terms');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('displays error message when error prop is provided', () => {
    render(<CheckboxField id="terms" label="Accept Terms" error="Must accept" />);

    expect(screen.getByText('Must accept')).toBeInTheDocument();
  });

  it('does not show error when error is not provided', () => {
    render(<CheckboxField id="terms" label="Accept Terms" />);

    expect(screen.queryByText('Must accept')).not.toBeInTheDocument();
  });

  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn();

    render(<CheckboxField id="terms" label="Accept Terms" onChange={handleChange} />);

    await userEvent.click(screen.getByLabelText('Accept Terms'));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
