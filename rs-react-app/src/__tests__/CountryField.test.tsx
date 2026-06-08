import { render, screen } from '@testing-library/react';
import CountryField from '../components/forms/FormFields/CountryField';

describe('CountryField component', () => {
  const options = [
    { name: 'United States', code: 'US' },
    { name: 'Germany', code: 'DE' },
  ];

  it('renders label and input with datalist', () => {
    render(<CountryField id="country" label="Country" options={options} />);

    const input = screen.getByRole('combobox', { name: 'Country' });

    expect(input).toBeInTheDocument();

    expect(input).toHaveAttribute('list', 'country-list');

    expect(document.getElementById('country-list')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<CountryField id="country" label="Country" options={options} error="Invalid country" />);

    expect(screen.getByText('Invalid country')).toBeInTheDocument();
  });

  it('passes additional input props', () => {
    render(<CountryField id="country" label="Country" options={options} placeholder="Select..." />);

    expect(screen.getByPlaceholderText('Select...')).toBeInTheDocument();
  });
});
