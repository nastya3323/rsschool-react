import { render, screen } from '@testing-library/react';
import type { Character } from '../App';
import CardList from '../components/CardList/CardList';

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
  },
];

describe('CardList component', () => {
  it('displays correct number of cards when data provided', () => {
    render(<CardList results={mockCharacters} error={null} isLoading={false} />);

    const cards = screen.getByTestId('card-list');
    expect(cards.children).toHaveLength(2);
  });

  it('shows spinner when loading', () => {
    render(<CardList results={[]} error={null} isLoading={true} />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<CardList results={[]} error="Something went wrong" isLoading={false} />);

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('renders empty list when results array is empty and not loading nor error', () => {
    render(<CardList results={[]} error={null} isLoading={false} />);

    const cards = screen.getByTestId('card-list');
    expect(cards.children).toHaveLength(0);
  });
});
