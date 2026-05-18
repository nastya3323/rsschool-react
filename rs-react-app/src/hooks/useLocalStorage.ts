import { useEffect, useState } from 'react';

export default function useLocalStorage(key: string, initialValue: string): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState<string>(() => {
    try {
      const item = localStorage.getItem(key);
      return item || initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
