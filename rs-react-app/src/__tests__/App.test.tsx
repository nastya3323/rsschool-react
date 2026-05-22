import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

vi.mock('../pages/HomePage', () => ({ default: () => <div data-testid="home-page">Home Page Mock</div> }));

vi.mock('../pages/About', () => ({ default: () => <div data-testid="about-page">About Page Mock</div> }));

vi.mock('../pages/NotFound', () => ({ default: () => <div data-testid="not-found-page">404 Not Found</div> }));

describe('App', () => {
  const renderApp = (initialEntries: string[]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    );
  };

  it('renders HomePage for "/"', () => {
    renderApp(['/']);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders About for "/about"', () => {
    renderApp(['/about']);
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
  });

  it('renders NotFound for unknown route', () => {
    renderApp(['/unknown']);
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
