import { createSlice } from '@reduxjs/toolkit';
import type { Country } from '../../types';

const defaultCountries: Country[] = [
  { code: 'RU', name: 'Russia' },
  { code: 'US', name: 'USA' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
];

interface CountriesState {
  list: Country[];
}

const initialState: CountriesState = {
  list: defaultCountries,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export default countriesSlice.reducer;
