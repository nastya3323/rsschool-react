import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import Header from '../components/Header/Header';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

describe('Header theme toggle', () => {
  it('toggles theme when button clicked', async () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🌙');
    
    await userEvent.click(button);
    expect(button).toHaveTextContent('☀️');
  });
});
