import { render, screen } from '@testing-library/react';
import Button from '../components/Button/Button';
import userEvent from '@testing-library/user-event';

describe('Button component', () => {
  it('renders children', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies additional className', () => {
    render(
      <Button onClick={() => {}} className="extra">
        Button
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('button extra');
  });

  it('can be disabled', () => {
    render(
      <Button onClick={() => {}} disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled and clicked', async () => {
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
