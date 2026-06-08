import { render, screen } from '@testing-library/react';
import InputField from '../components/forms/FormFields/InputField';
import userEvent from '@testing-library/user-event';

describe('InputField component', () => {
  it('renders label and input', () => {
    render(<InputField id="name" label="Name" />);

    const input = screen.getByLabelText('Name');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'name');
  });

  it('displays error', () => {
    render(<InputField id="name" label="Name" error="Required" />);

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('applies extra props like placeholder and type', () => {
    render(<InputField id="name" label="Name" placeholder="Your name" type="text" />);

    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const handleChange = vi.fn();

    render(<InputField id="name" label="Name" onChange={handleChange} />);

    await userEvent.type(screen.getByLabelText('Name'), 'John');

    expect(handleChange).toHaveBeenCalled();
  });
});
