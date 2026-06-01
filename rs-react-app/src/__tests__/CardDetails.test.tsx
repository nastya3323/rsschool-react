import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardDetails from '../components/Card/CardDetails';
import type { Character } from '../types/types';
import * as api from '../api/rickAndMortyApi';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../api/rickAndMortyApi');

const mockGetCharacterById = vi.mocked(api.useGetCharacterByIdQuery);

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  location: { name: 'Earth' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

describe('CardDetails component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCardDetails = (initialEntries: string[]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <CardDetails />
      </MemoryRouter>
    );
  };

  it('shows placeholder when no detailsId in URL', () => {
    mockGetCharacterById.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });

    renderCardDetails(['/']);
    expect(screen.getByText(/Click on a character to see details/i)).toBeInTheDocument();
  });

  it('fetches and displays character details when detailsId is present', async () => {
    mockGetCharacterById.mockReturnValue({
      data: mockCharacter,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });

    renderCardDetails(['/?details=1']);

    await waitFor(() => {
      expect(screen.getByText('Character Details')).toBeInTheDocument();
    });

    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Alive/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByText(/Male/i)).toBeInTheDocument();
    expect(screen.getByText(/Species/i)).toBeInTheDocument();
    expect(screen.getByText(/Human/i)).toBeInTheDocument();
    expect(screen.getByText(/Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Earth/i)).toBeInTheDocument();

    const img = screen.getByAltText('Rick Sanchez');
    expect(img).toHaveAttribute('src', mockCharacter.image);
  });

  it('shows spinner when loading', () => {
    mockGetCharacterById.mockReturnValue({
      data: undefined,
      isFetching: true,
      error: null,
      refetch: vi.fn(),
    });

    renderCardDetails(['/?details=1']);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows error when fetch fails', async () => {
    mockGetCharacterById.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: 'Failed to load details',
      refetch: vi.fn(),
    });

    renderCardDetails(['/?details=1']);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load details/i)).toBeInTheDocument();
    });
  });

  it('removes details from URL and shows placeholder when close button clicked', async () => {
    mockGetCharacterById.mockReturnValue({
      data: mockCharacter,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });

    renderCardDetails(['/?details=1']);

    await waitFor(() => {
      expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: '✕' });

    await userEvent.click(button);
    expect(await screen.findByText(/Click on a character to see details/i)).toBeInTheDocument();
  });
});
