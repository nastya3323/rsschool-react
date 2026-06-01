import type { Character, FetchCharactersResponse } from '../types/types';
import { rickAndMortyApi } from '../api/rickAndMortyApi';
import { configureStore } from '@reduxjs/toolkit';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  location: { name: 'Earth' },
  image: 'url',
};

const mockResponse: FetchCharactersResponse = {
  info: { count: 1, pages: 1, next: null, prev: null },
  results: [mockCharacter],
};

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

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

describe('rickAndMortyApi', () => {
  let store: ReturnType<typeof createTestStore>;

  const createTestStore = () =>
    configureStore({
      reducer: {
        [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rickAndMortyApi.middleware),
    });

  beforeEach(() => {
    mockFetch.mockReset();
    store = createTestStore();
  });

  describe('getCharacters', () => {
    it('should fetch characters with search term and page', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockResponse));

      const result = await store
        .dispatch(rickAndMortyApi.endpoints.getCharacters.initiate({ searchTerm: 'rick', page: 1 }))
        .unwrap();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const arg = mockFetch.mock.calls[0][0];
      const url = arg instanceof Request ? arg.url : arg;
      expect(url).toBe('https://rickandmortyapi.com/api/character?name=rick&page=1');

      expect(result).toEqual(mockResponse);
    });

    it('should throw "No characters found" on 404', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse({}, false, 404));

      const initiation = store.dispatch(
        rickAndMortyApi.endpoints.getCharacters.initiate({ searchTerm: 'unknown', page: 1 })
      );

      await expect(initiation.unwrap()).rejects.toThrow('No characters found');
    });

    it('should throw API error on other non-ok status', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse({}, false, 500));

      const initiation = store.dispatch(
        rickAndMortyApi.endpoints.getCharacters.initiate({ searchTerm: 'rick', page: 1 })
      );

      await expect(initiation.unwrap()).rejects.toThrow('API error (500)');
    });

    it('should return cached data for the same searchTerm and page', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockResponse));

      const result1 = await store
        .dispatch(rickAndMortyApi.endpoints.getCharacters.initiate({ searchTerm: 'rick', page: 1 }))
        .unwrap();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result1.results).toEqual([mockCharacter]);

      const result2 = await store
        .dispatch(rickAndMortyApi.endpoints.getCharacters.initiate({ searchTerm: 'rick', page: 1 }))
        .unwrap();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result2.results).toEqual([mockCharacter]);
    });

    it('should make new request for different arguments', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockResponse));
      mockFetch.mockResolvedValueOnce(createFetchResponse({ info: mockResponse.info, results: [] }));

      await store.dispatch(rickAndMortyApi.endpoints.getCharacters.initiate({ searchTerm: 'rick', page: 1 })).unwrap();

      await store.dispatch(rickAndMortyApi.endpoints.getCharacters.initiate({ searchTerm: 'rick', page: 2 })).unwrap();

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('getCharacterById', () => {
    it('should fetch character by id', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockCharacter));

      const result = await store.dispatch(rickAndMortyApi.endpoints.getCharacterById.initiate(1)).unwrap();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const arg = mockFetch.mock.calls[0][0];
      const url = arg instanceof Request ? arg.url : arg;
      expect(url).toBe('https://rickandmortyapi.com/api/character/1');

      expect(result).toEqual(mockCharacter);
    });

    it('should throw error on 404', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(null, false, 404));

      const initiation = store.dispatch(rickAndMortyApi.endpoints.getCharacterById.initiate(999));

      await expect(initiation.unwrap()).rejects.toMatchObject({
        status: 404,
        data: null,
      });
    });

    it('should throw error when response not ok', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse({ error: 'server error' }, false, 500));

      const initiation = store.dispatch(rickAndMortyApi.endpoints.getCharacterById.initiate(1));

      await expect(initiation.unwrap()).rejects.toMatchObject({
        status: 500,
        data: { error: 'server error' },
      });
    });

    it('should return cached data without second fetch for same arguments', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockCharacter));

      const result1 = await store.dispatch(rickAndMortyApi.endpoints.getCharacterById.initiate(1)).unwrap();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(mockCharacter);

      const result2 = await store.dispatch(rickAndMortyApi.endpoints.getCharacterById.initiate(1)).unwrap();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result2).toEqual(mockCharacter);
    });
  });

  describe('getCharactersByIds', () => {
    it('should fetch multiple characters by ids', async () => {
      const characters = [mockCharacter, { ...mockCharacter, id: 2, name: 'Summer' }];

      mockFetch.mockResolvedValueOnce(createFetchResponse(characters));

      const result = await store.dispatch(rickAndMortyApi.endpoints.getCharactersByIds.initiate([1, 2])).unwrap();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const arg = mockFetch.mock.calls[0][0];
      const url = arg instanceof Request ? arg.url : arg;
      expect(url).toBe('https://rickandmortyapi.com/api/character/1,2');

      expect(result).toEqual(characters);
    });

    it('should fetch single character and wrap in array', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockCharacter));

      const result = await store.dispatch(rickAndMortyApi.endpoints.getCharactersByIds.initiate([1])).unwrap();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const arg = mockFetch.mock.calls[0][0];
      const url = arg instanceof Request ? arg.url : arg;
      expect(url).toBe('https://rickandmortyapi.com/api/character/1');

      expect(result).toEqual([mockCharacter]);
    });

    it('should throw error on 404', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(null, false, 404));

      const initiation = store.dispatch(rickAndMortyApi.endpoints.getCharactersByIds.initiate([999]));

      await expect(initiation.unwrap()).rejects.toMatchObject({
        status: 404,
        data: null,
      });
    });

    it('should throw error when response not ok', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse({ error: 'server error' }, false, 500));

      const initiation = store.dispatch(rickAndMortyApi.endpoints.getCharacterById.initiate(1));

      await expect(initiation.unwrap()).rejects.toMatchObject({
        status: 500,
        data: { error: 'server error' },
      });
    });
  });
});
