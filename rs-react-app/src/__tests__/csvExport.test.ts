import type { MockInstance } from 'vitest';
import type { Character } from '../types/types';
import { downloadSelectedCharacters } from '../utils/csvExport';

describe('downloadSelectedCharacters', () => {
  let mockLink: {
    click: MockInstance;
    setAttribute: MockInstance;
    href: string;
    download: string;
  };

  let createObjectURLSpy: MockInstance;
  let revokeObjectURLSpy: MockInstance;

  beforeEach(() => {
    mockLink = {
      click: vi.fn(),
      setAttribute: vi.fn(),
      href: '',
      download: '',
    };

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node as Node);
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node as Node);

    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('downloads CSV for selected characters', () => {
    const mockCharacters: Character[] = [
      {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        location: { name: 'Earth (C-137)' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      },
    ];

    downloadSelectedCharacters(mockCharacters);
    expect(createObjectURLSpy).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockLink.click).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url');
  });

  it('does nothing for empty array', () => {
    downloadSelectedCharacters([]);
    expect(createObjectURLSpy).not.toHaveBeenCalled();
  });
});
