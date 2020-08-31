import { Name } from '@/data/minister.model';

export function slugify(name: Name): string {
  const nameParts = [name.given].concat(name.additional);

  if (name.surname) {
    nameParts.push(name.surname);
  }
  if (name.suffix) {
    nameParts.push(name.suffix);
  }

  return nameParts
    .join('-')
    .toLocaleLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
}
