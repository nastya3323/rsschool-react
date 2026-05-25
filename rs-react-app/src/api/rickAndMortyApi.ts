import type { Character, FetchCharactersResponse } from '../types/types';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

async function fetchCharacters(searchTerm: string = '', page: number = 1): Promise<FetchCharactersResponse> {
  const url = `${BASE_URL}?name=${searchTerm}&page=${page}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No characters found');
    }
    throw new Error(`API error (${response.status})`);
  }

  const data = await response.json();

  if (data.results.length === 0) {
    throw new Error('No characters found');
  }

  return { results: data.results, info: data.info };
}

async function fetchCharacterById(id: number): Promise<Character> {
  const url = `${BASE_URL}/${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to load character details');
  }

  const data = await response.json();

  return data;
}

async function fetchCharactersByIds(ids: number[]): Promise<Character[]> {
  if (!ids.length) {
    return [];
  }

  const url = `${BASE_URL}/${ids.join(',')}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch selected characters');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

export { fetchCharacters, fetchCharacterById, fetchCharactersByIds };
