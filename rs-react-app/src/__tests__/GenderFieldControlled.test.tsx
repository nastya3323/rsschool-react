import { render, screen } from '@testing-library/react';
import GenderFieldControlled from '../components/forms/FormFields/GenderFieldControlled';
import userEvent from '@testing-library/user-event';

describe('GenderFieldControlled component', () => {
  const options = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  it('renders radio buttons with correct checked state', () => {
    render(<GenderFieldControlled id="gender" label="Gender" options={options} selectedValue="female" />);

    const femaleRadio = screen.getByLabelText('Female');
    expect(femaleRadio).toBeChecked();

    expect(screen.getByLabelText('Male')).not.toBeChecked();
  });

  it('shows error message', () => {
    render(<GenderFieldControlled id="gender" label="Gender" options={options} error="Select gender" />);

    expect(screen.getByText('Select gender')).toBeInTheDocument();
  });

  it('calls onChange when a radio is selected', async () => {
    const handleChange = vi.fn();

    render(
      <GenderFieldControlled id="gender" label="Gender" options={options} selectedValue="" onChange={handleChange} />
    );

    await userEvent.click(screen.getByLabelText('Other'));

    expect(handleChange).toHaveBeenCalledWith('other');
  });
});
