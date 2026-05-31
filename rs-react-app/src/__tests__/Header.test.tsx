import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import Header from '../components/Header/Header';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { rickAndMortyApi } from '../api/rickAndMortyApi';
import { Provider } from 'react-redux';

describe('Header component', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rickAndMortyApi.middleware),
    });

  describe('Header theme toggle', () => {
    it('toggles theme when button clicked', async () => {
      const store = createStore();
      render(
        <Provider store={store}>
          <ThemeProvider>
            <MemoryRouter>
              <Header />
            </MemoryRouter>
          </ThemeProvider>
        </Provider>
      );
      const themeButton = screen.getByLabelText(/Toggle theme/i);
      expect(themeButton).toHaveTextContent('🌙');

      await userEvent.click(themeButton);
      expect(themeButton).toHaveTextContent('☀️');
    });
  });

  describe('Header refresh button', () => {
    it('dispatches invalidateTags when clicked', async () => {
      const store = createStore();

      const dispatchSpy = vi.spyOn(store, 'dispatch');
      render(
        <Provider store={store}>
          <ThemeProvider>
            <MemoryRouter>
              <Header />
            </MemoryRouter>
          </ThemeProvider>
        </Provider>
      );

      const refreshButton = screen.getByRole('button', { name: /refresh/i });

      await userEvent.click(refreshButton);

      expect(dispatchSpy).toHaveBeenCalledWith(rickAndMortyApi.util.invalidateTags(['Characters', 'Character']));
    });
  });
});
