import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';
import { Virtuoso } from 'react-virtuoso';

import styles from './country-list.module.css';
import { memo, useMemo } from 'react';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const populationsCache = useMemo(() => {
      const map = new Map<string, number>();

      countries.forEach((country) => {
        const yearDataMap = createYearDataMap(country.data);
        const pop = getPopulationForYear(yearDataMap, selectedYear) ?? 0;
        map.set(country.id, pop);
      });

      return map;
    }, [countries, selectedYear]);

    const filteredCountries = useMemo(() => {
      return countries
        .filter((c) => {
          const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
          return matchesSearch && matchesRegion;
        })
        .sort((a, b) => {
          if (sortField === 'name') {
            return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
          } else {
            const popA = populationsCache.get(a.id) ?? 0;
            const popB = populationsCache.get(b.id) ?? 0;
            return sortOrder === 'asc' ? popA - popB : popB - popA;
          }
        });
    }, [countries, searchQuery, selectedRegion, sortField, sortOrder, populationsCache]);

    return (
      <div className={styles.countryList}>
        <Virtuoso
          style={{ height: '100vh' }}
          totalCount={filteredCountries.length}
          itemContent={(index) => (
            <CountryCard
              country={filteredCountries[index]}
              selectedYear={selectedYear}
              selectedColumns={selectedColumns}
            />
          )}
        />
      </div>
    );
  }
);
