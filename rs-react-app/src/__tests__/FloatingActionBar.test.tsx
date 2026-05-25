import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectedReducer, { clearAll } from '../store/selectedSlice';
import FloatingActionBar from '../components/FloatingActionBar/FloatingActionBar';

describe('FloatingActionBar component', () => {
  const renderWithStore = (selectedIds: number[]) => {
    const store = configureStore({
      reducer: { selected: selectedReducer },
      preloadedState: { selected: { ids: selectedIds } },
    });

    return render(
      <Provider store={store}>
        <FloatingActionBar />
      </Provider>
    );
  };

  it('does not render when no items selected', () => {
    renderWithStore([]);
    expect(screen.queryByText(/Selected:/i)).not.toBeInTheDocument();
  });

  it('renders when at least one item selected', () => {
    renderWithStore([1]);
    expect(screen.getByText(/Selected: 1 character/i)).toBeInTheDocument();
  });

  it('displays correct pluralization', () => {
    renderWithStore([1, 2]);
    expect(screen.getByText(/Selected: 2 characters/i)).toBeInTheDocument();
  });

  it('calls dispatch clearAll when "Clear all" clicked', async () => {
    const store = configureStore({
      reducer: { selected: selectedReducer },
      preloadedState: { selected: { ids: [1, 2] } },
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <FloatingActionBar />
      </Provider>
    );

    const clearButton = screen.getByRole('button', { name: /Clear all/i });

    await userEvent.click(clearButton);
    expect(dispatchSpy).toHaveBeenCalledWith(clearAll());
  });
});
