import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Character, FetchCharactersResponse } from '../types/types';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

const CACHE_TTL_SECONDS = Number(import.meta.env.API_RTK_CACHE_TTL_SECONDS) || 180;

export const rickAndMortyApi = createApi({
  reducerPath: 'rickAndMortyApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  keepUnusedDataFor: CACHE_TTL_SECONDS,
  tagTypes: ['Characters', 'Character'],
  endpoints: (builder) => ({
    getCharacters: builder.query<FetchCharactersResponse, { searchTerm: string; page: number }>({
      query: ({ searchTerm = '', page = 1 }) => {
        const params = new URLSearchParams();

        if (searchTerm) {
          params.append('name', searchTerm);
        }

        params.append('page', String(page));

        return `?${params.toString()}`;
      },

      providesTags: (result, error, { searchTerm }) => {
        return searchTerm ? [{ type: 'Characters', id: searchTerm }] : ['Characters'];
      },

      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return 'No characters found';
        }

        return `API error (${response.status})`;
      },
    }),

    getCharacterById: builder.query<Character, number>({
      query: (id) => `${id}`,
      providesTags: (result, error, id) => [{ type: 'Character', id }],
    }),

    getCharactersByIds: builder.query<Character[], number[]>({
      query: (ids) => ids.join(','),
      transformResponse: (response: Character | Character[]) => {
        return Array.isArray(response) ? response : [response];
      },

      providesTags: (result) => {
        return result ? result.map(({ id }) => ({ type: 'Character', id })) : ['Character'];
      },
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterByIdQuery, useLazyGetCharactersByIdsQuery } = rickAndMortyApi;
