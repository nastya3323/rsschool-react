import userEvent from '@testing-library/user-event';
import TestErrorButton from '../components/TestErrorButton/TestErrorButton';
import ErrorBoundary from '../ErrorBoundary';
import { render, screen } from '@testing-library/react';

describe('TestErrorButton component', () => {
  it('throws error when clicked', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <TestErrorButton isLoading={false} />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /test error/i });

    await userEvent.click(button);

    expect(await screen.findByText(/fallback ui/i)).toBeInTheDocument();

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});
