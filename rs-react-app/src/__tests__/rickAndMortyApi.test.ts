import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Character, FetchCharactersResponse } from '../types/types';
import { fetchCharacterById, fetchCharacters, fetchCharactersByIds } from '../api/rickAndMortyApi';

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

describe('rickAndMortyApi', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('fetchCharacters', () => {
    it('should fetch characters with search term and page', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ info: mockResponse.info, results: mockResponse.results }),
      });

      const result = await fetchCharacters('rick', 1);

      expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?name=rick&page=1');

      expect(result).toEqual(mockResponse);
    });

    it('should throw "No characters found" on 404', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) });

      await expect(fetchCharacters('unknown', 1)).rejects.toThrow('No characters found');
    });

    it('should throw API error on other non-ok status', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });

      await expect(fetchCharacters('rick', 1)).rejects.toThrow('API error (500)');
    });

    it('should throw when results array is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ info: {}, results: [] }),
      });
      await expect(fetchCharacters('nonexistent', 1)).rejects.toThrow('No characters found');
    });
  });

  describe('fetchCharacterById', () => {
    it('should fetch character by id', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacter,
      });

      const result = await fetchCharacterById(1);

      expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1');

      expect(result).toEqual(mockCharacter);
    });

    it('should throw error when response not ok', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

      await expect(fetchCharacterById(999)).rejects.toThrow('Failed to load character details');
    });
  });

  describe('fetchCharactersByIds', () => {
    it('should fetch multiple characters by ids', async () => {
      const characters = [mockCharacter, { ...mockCharacter, id: 2, name: 'Summer' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => characters,
      });

      const result = await fetchCharactersByIds([1, 2]);

      expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1,2');

      expect(result).toEqual(characters);
    });

    it('should fetch single character and wrap in array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacter,
      });

      const result = await fetchCharactersByIds([1]);

      expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1');

      expect(result).toEqual([mockCharacter]);
    });

    it('should return empty array when ids array is empty', async () => {
      const result = await fetchCharactersByIds([]);

      expect(mockFetch).not.toHaveBeenCalled();

      expect(result).toEqual([]);
    });

    it('should throw error when response not ok', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

      await expect(fetchCharactersByIds([999])).rejects.toThrow('Failed to fetch selected characters');
    });
  });
});
