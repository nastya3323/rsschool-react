import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';

describe('NotFound page', () => {
  it('renders 404 message and link to home', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Go back to Home/i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Go back to Home/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
