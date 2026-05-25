import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectedReducer, { clearAll } from '../store/selectedSlice';
import FloatingActionBar from '../components/FloatingActionBar/FloatingActionBar';
import * as api from '../api/rickAndMortyApi';
import * as csvExport from '../utils/csvExport';

vi.mock('../api/rickAndMortyApi');
vi.mock('../utils/csvExport');

const mockFetchCharactersByIds = api.fetchCharactersByIds as ReturnType<typeof vi.fn>;
const mockDownloadSelectedCharacters = csvExport.downloadSelectedCharacters as ReturnType<typeof vi.fn>;

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('fetches characters and downloads CSV when Download button clicked', async () => {
    const selectedIds = [1, 2];
    const mockCharacters = [
      {
        id: 1,
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        location: { name: 'Earth' },
        image: 'url',
      },
      {
        id: 2,
        name: 'Morty',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        location: { name: 'Earth' },
        image: 'url',
      },
    ];
    mockFetchCharactersByIds.mockResolvedValueOnce(mockCharacters);
    mockDownloadSelectedCharacters.mockImplementationOnce(() => {});

    renderWithStore(selectedIds);

    const downloadButton = screen.getByRole('button', { name: /Download/i });
    await userEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockFetchCharactersByIds).toHaveBeenCalledWith(selectedIds);
      expect(mockDownloadSelectedCharacters).toHaveBeenCalledWith(mockCharacters);
    });
  });

  it('shows loading state on button while downloading', async () => {
    mockFetchCharactersByIds.mockImplementationOnce(() => new Promise(() => {}));
    renderWithStore([1]);

    const downloadButton = screen.getByRole('button', { name: /Download/i });

    await userEvent.click(downloadButton);

    expect(downloadButton).toHaveTextContent('Loading...');
  });
});
