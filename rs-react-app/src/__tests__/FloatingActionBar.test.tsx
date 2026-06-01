import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectedReducer, { clearAll } from '../store/selectedSlice';
import FloatingActionBar from '../components/FloatingActionBar/FloatingActionBar';
import { rickAndMortyApi } from '../api/rickAndMortyApi';
import * as csvExport from '../utils/csvExport';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

vi.mock('../utils/csvExport', () => ({
  downloadSelectedCharacters: vi.fn(),
}));

const mockDownloadSelectedCharacters = csvExport.downloadSelectedCharacters as ReturnType<typeof vi.fn>;

const createFetchResponse = (data: unknown, ok = true, status = 200) => {
  const response = {
    ok,
    status,
    headers: new Headers(),
    json: async () => data,
    text: async () => JSON.stringify(data),
    clone() {
      return createFetchResponse(data, ok, status);
    },
  };
  return response;
};

describe('FloatingActionBar component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  const renderWithStore = (selectedIds: number[]) => {
    const store = configureStore({
      reducer: {
        selected: selectedReducer,
        [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rickAndMortyApi.middleware),
      preloadedState: {
        selected: { ids: selectedIds },
      },
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
      reducer: {
        selected: selectedReducer,
        [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rickAndMortyApi.middleware),
      preloadedState: {
        selected: { ids: [1, 2] },
      },
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

    mockFetch.mockResolvedValueOnce(createFetchResponse(mockCharacters));

    renderWithStore(selectedIds);

    const downloadButton = screen.getByRole('button', { name: /Download/i });
    await userEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const arg = mockFetch.mock.calls[0][0];
      const url = arg instanceof Request ? arg.url : arg;
      expect(url).toBe('https://rickandmortyapi.com/api/character/1,2');

      expect(mockDownloadSelectedCharacters).toHaveBeenCalledWith(mockCharacters);
    });
  });

  it('shows loading state on button while downloading', async () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    renderWithStore([1]);

    const downloadButton = screen.getByRole('button', { name: /Download/i });

    await userEvent.click(downloadButton);

    expect(downloadButton).toHaveTextContent('Loading...');
  });

  it('handles API error gracefully', async () => {
    mockFetch.mockResolvedValueOnce(createFetchResponse({}, false, 404));

    renderWithStore([1]);

    const downloadButton = screen.getByRole('button', { name: /Download/i });

    await userEvent.click(downloadButton);

    await waitFor(() => {
      expect(downloadButton).toHaveTextContent('Download');
    });

    expect(mockDownloadSelectedCharacters).not.toHaveBeenCalled();
    expect(screen.getByText(/Could not download selected characters/i)).toBeInTheDocument();
  });
});
