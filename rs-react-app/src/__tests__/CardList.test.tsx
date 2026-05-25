import { render, screen } from '@testing-library/react';
import CardList from '../components/CardList/CardList';
import selectedReducer from '../store/selectedSlice';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import type { Character } from '../types/types';
import userEvent from '@testing-library/user-event';

const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Rick',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    location: {
      name: 'Earth',
    },
    image: 'url',
  },
  {
    id: 2,
    name: 'Morty',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    location: {
      name: 'Earth',
    },
    image: 'url',
  },
];

const mockStore = (selectedIds: number[]) =>
  configureStore({
    reducer: { selected: selectedReducer },
    preloadedState: { selected: { ids: selectedIds } },
  });

describe('CardList component', () => {
  it('displays correct number of cards when data provided', () => {
    const store = mockStore([]);

    render(
      <Provider store={store}>
        <CardList results={mockCharacters} error={null} isLoading={false} onCardClick={() => {}} />
      </Provider>
    );

    const cards = screen.getByTestId('card-list');
    expect(cards.children).toHaveLength(2);
  });

  it('shows spinner when loading', () => {
    const store = mockStore([]);

    render(
      <Provider store={store}>
        <CardList results={[]} error={null} isLoading={true} onCardClick={() => {}} />
      </Provider>
    );

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const store = mockStore([]);

    render(
      <Provider store={store}>
        <CardList results={[]} error="Something went wrong" isLoading={false} onCardClick={() => {}} />
      </Provider>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('renders empty list when results array is empty and not loading nor error', () => {
    const store = mockStore([]);

    render(
      <Provider store={store}>
        <CardList results={[]} error={null} isLoading={false} onCardClick={() => {}} />
      </Provider>
    );

    const cards = screen.getByTestId('card-list');
    expect(cards.children).toHaveLength(0);
  });

  it('renders cards with checkboxes reflecting selected state', () => {
    const store = mockStore([1]);

    render(
      <Provider store={store}>
        <CardList results={mockCharacters} error={null} isLoading={false} onCardClick={() => {}} />
      </Provider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('dispatches toggleSelect when checkbox clicked', async () => {
    const store = mockStore([]);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <CardList results={mockCharacters} error={null} isLoading={false} onCardClick={() => {}} />
      </Provider>
    );
    const checkbox = screen.getAllByRole('checkbox')[0];
    await userEvent.click(checkbox);

    expect(dispatchSpy).toHaveBeenCalledWith({ type: 'selected/toggleSelect', payload: 1 });
  });
});
