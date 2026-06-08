import { render, screen } from '@testing-library/react';
import GenderFieldUncontrolled from '../components/forms/FormFields/GenderFieldUncontrolled';
import userEvent from '@testing-library/user-event';

describe('GenderFieldUncontrolled component', () => {
  const options = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  it('renders with defaultChecked based on defaultValue', () => {
    render(<GenderFieldUncontrolled label="Gender" name="gender" options={options} defaultValue="female" />);

    expect(screen.getByLabelText('Female')).toBeChecked();
    expect(screen.getByLabelText('Male')).not.toBeChecked();
  });

  it('shows error', () => {
    render(<GenderFieldUncontrolled label="Gender" name="gender" options={options} error="Required" />);

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('allows selecting a different radio', async () => {
    render(<GenderFieldUncontrolled label="Gender" name="gender" options={options} defaultValue="male" />);

    const maleRadio = screen.getByLabelText('Male');
    const femaleRadio = screen.getByLabelText('Female');

    expect(maleRadio).toBeChecked();

    await userEvent.click(femaleRadio);

    expect(femaleRadio).toBeChecked();
    expect(maleRadio).not.toBeChecked();
  });
});
