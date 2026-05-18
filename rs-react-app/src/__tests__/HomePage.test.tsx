import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as api from '../api/rickAndMortyApi';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import HomePage from '../pages/HomePage';

vi.mock('../api/rickAndMortyApi');

const mockFetchCharacters = api.fetchCharacters as ReturnType<typeof vi.fn>;
const mockFetchCharacterById = api.fetchCharacterById as ReturnType<typeof vi.fn>;

const mockCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  location: { name: 'Earth' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

const mockInfo = { count: 1, pages: 1, next: null, prev: null };

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderHomePage = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <HomePage />
      </MemoryRouter>
    );
  };

  it('fetches and displays characters on mount', async () => {
    mockFetchCharacters.mockResolvedValueOnce({ results: [mockCharacter], info: mockInfo });

    renderHomePage();
    await waitFor(() => {
      expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Results \(1\)/i)).toBeInTheDocument();
  });

  it('shows error when API fails', async () => {
    mockFetchCharacters.mockRejectedValueOnce(new Error('API error'));

    renderHomePage();
    await waitFor(() => {
      expect(screen.getByText(/API error/i)).toBeInTheDocument();
    });
  });

  it('performs search when submitting search bar', async () => {
    mockFetchCharacters.mockResolvedValueOnce({ results: [mockCharacter], info: mockInfo });

    mockFetchCharacters.mockResolvedValueOnce({
      results: [{ ...mockCharacter, id: 2, name: 'Summer' }],
      info: mockInfo,
    });

    renderHomePage();
    await waitFor(() => expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument());

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /find/i });

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Summer');
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(mockFetchCharacters).toHaveBeenLastCalledWith('Summer', 1);
    });

    await waitFor(() => {
      expect(screen.queryByText(/Rick Sanchez/i)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/Summer/i)).toBeInTheDocument();
    });
  });

  it('opens character details when card is clicked', async () => {
    mockFetchCharacters.mockResolvedValueOnce({ results: [mockCharacter], info: mockInfo });
    mockFetchCharacterById.mockResolvedValueOnce(mockCharacter);

    renderHomePage();
    await waitFor(() => expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument());

    const card = screen.getByTestId('card');
    await userEvent.click(card);

    await waitFor(() => {
      expect(mockFetchCharacterById).toHaveBeenCalledWith(1);
      expect(screen.getByText('Character Details')).toBeInTheDocument();
    });
  });

  it('closes details when clicking on left column', async () => {
    mockFetchCharacters.mockResolvedValueOnce({ results: [mockCharacter], info: mockInfo });
    mockFetchCharacterById.mockResolvedValueOnce(mockCharacter);

    renderHomePage();
    await waitFor(() => expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument());

    const card = screen.getByTestId('card');
    await userEvent.click(card);
    await waitFor(() => expect(screen.getByText('Character Details')).toBeInTheDocument());

    const leftColumn = screen.getByTestId('left-column');
    await userEvent.click(leftColumn);

    expect(screen.queryByText('Character Details')).not.toBeInTheDocument();
  });

  it('handles pagination when next/prev provided', async () => {
    const mockInfoWithNext = {
      count: 2,
      pages: 2,
      next: 'https://rickandmortyapi.com/api/character?page=2',
      prev: null,
    };

    mockFetchCharacters.mockResolvedValueOnce({ results: [mockCharacter], info: mockInfoWithNext });

    mockFetchCharacters.mockResolvedValueOnce({
      results: [{ ...mockCharacter, id: 2, name: 'Summer' }],
      info: { ...mockInfoWithNext, next: null, prev: '?page=1' },
    });

    renderHomePage();
    await waitFor(() => expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument());

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    expect(mockFetchCharacters).toHaveBeenLastCalledWith('', 2);
    await waitFor(() => expect(screen.getByText(/Summer/i)).toBeInTheDocument());
  });
});
