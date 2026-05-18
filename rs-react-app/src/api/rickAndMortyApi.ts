import type { FetchCharactersResponse } from '../types/types';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

export default async function fetchCharacters(
  searchTerm: string = '',
  page: number = 1
): Promise<FetchCharactersResponse> {
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
