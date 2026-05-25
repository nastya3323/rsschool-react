import type { Character } from '../types/types';

function convertToCSV(characters: Character[]): string {
  if (!characters.length) {
    return '';
  }

  const headers = ['Id', 'Name', 'Status', 'Species', 'Gender', 'Location', 'Image'];

  const rows = characters.map((char) => {
    return [char.id, char.name, char.status, char.species, char.gender, char.location.name, char.image].join(';');
  });

  return [headers.join(';'), ...rows].join('\n');
}

export function downloadSelectedCharacters(characters: Character[]) {
  if (!characters.length) {
    return;
  }

  const csv = convertToCSV(characters);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${characters.length}_items.csv`);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
