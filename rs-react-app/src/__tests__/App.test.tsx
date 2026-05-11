import userEvent from '@testing-library/user-event';
import App, { type Character } from '../App';
import { render, screen, waitFor } from '@testing-library/react';
import type { MockInstance } from 'vitest';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  location: { name: 'Earth' },
};

const STORAGE_KEY = 'lastSearchQuery';
const FIRST_PAGE_URL = 'https://rickandmortyapi.com/api/character?page=1';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('App integration with localStorage and API', () => {
  let getItemSpy: MockInstance;
  let setItemSpy: MockInstance;
  let removeItemSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockFetch.mockReset();

    getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    getItemSpy.mockClear();
    setItemSpy.mockClear();
    removeItemSpy.mockClear();
  });

  const waitForLoadingToFinish = async () => {
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /find/i });
      expect(button).toBeEnabled();
    });
  };

  it('should load saved query from localStorage on mount and perform search', async () => {
    localStorage.setItem(STORAGE_KEY, 'rick');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        return { results: [mockCharacter] };
      },
    });

    render(<App />);

    await waitFor(() => {
      expect(getItemSpy).toHaveBeenCalledWith(STORAGE_KEY);
    });

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('rick');
  });

  it('should save search query to localStorage on successful search', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [mockCharacter] }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        return { results: [mockCharacter] };
      },
    });

    render(<App />);
    await waitForLoadingToFinish();

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /find/i });

    await userEvent.type(input, 'rick');
    await userEvent.click(button);

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(STORAGE_KEY, 'rick');
    });
  });

  it('should remove localStorage key when searching empty string', async () => {
    localStorage.setItem(STORAGE_KEY, 'rick');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        return { results: [mockCharacter] };
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        return { results: [mockCharacter] };
      },
    });

    render(<App />);
    await waitForLoadingToFinish();

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /find/i });

    await userEvent.clear(input);
    await userEvent.click(button);

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_KEY);
    });

    expect(mockFetch).toHaveBeenCalledWith(FIRST_PAGE_URL);
  });

  it('trims whitespace from search query before saving', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        return { results: [mockCharacter] };
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        return { results: [mockCharacter] };
      },
    });

    render(<App />);
    await waitForLoadingToFinish();

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /find/i });

    await userEvent.type(input, '  rick  ');
    await userEvent.click(button);

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(STORAGE_KEY, 'rick');
    });

    expect(input).toHaveValue('rick');
  });

  it('overwrites existing localStorage value when new search performed', async () => {
    localStorage.setItem(STORAGE_KEY, 'old');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        return { results: [mockCharacter] };
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        return { results: [mockCharacter] };
      },
    });

    render(<App />);
    await waitForLoadingToFinish();

    const input = screen.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'jerry');

    const button = screen.getByRole('button', { name: /find/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(STORAGE_KEY, 'jerry');
    });
  });

  it('displays error message on API error (404)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [mockCharacter] }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    render(<App />);
    await waitForLoadingToFinish();

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /find/i });

    await userEvent.type(input, 'unknown');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/no characters found/i)).toBeInTheDocument();
    });
  });

  it('displays error message on API error (500)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [mockCharacter] }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    render(<App />);
    await waitForLoadingToFinish();

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /find/i });

    await userEvent.type(input, 'rick');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/API error \(500\)/i)).toBeInTheDocument();
    });
  });

  it('shows spinner while fetching', async () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    render(<App />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('updates searchResults after successful API response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        return { results: [mockCharacter] };
      },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/rick sanchez/i)).toBeInTheDocument();
    });
  });

  it('does not send duplicate request for same search term', async () => {
    localStorage.setItem(STORAGE_KEY, 'rick');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => {
        return { results: [mockCharacter] };
      },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/rick sanchez/i)).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /find/i });
    await userEvent.click(button);
    await userEvent.click(button);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
