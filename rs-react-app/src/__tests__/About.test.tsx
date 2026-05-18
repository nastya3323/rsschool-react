import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from '../pages/About';

describe('About page', () => {
  it('renders about content and links', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByText(/About Rick and Morty character search/i)).toBeInTheDocument();
    expect(screen.getByText(/Data is provided by/i)).toBeInTheDocument();

    const apiLink = screen.getByRole('link', { name: /Rick and Morty API/i });
    expect(apiLink).toHaveAttribute('href', 'https://rickandmortyapi.com/');

    const backLink = screen.getByRole('link', { name: /Back/i });
    expect(backLink).toHaveAttribute('href', '/');
  });
});
