import { Minister } from '@/data/minister.model';

export function nameDisplay(
  value: Minister,
  displayType?: 'full' | 'short'
): string {
  let nameParts = [];
  if (displayType && displayType === 'full') {
    if (value.name.prefix) {
      nameParts.push(value.name.prefix);
    }
    nameParts.push(value.name.given);
    if (value.name.additional) {
      nameParts = nameParts.concat(value.name.additional);
    }
    if (value.name.surname) {
      nameParts.push(value.name.surname);
    }
    if (value.name.suffix) {
      nameParts.push(value.name.suffix);
    }
  } else {
    nameParts.push(value.name.given);
    if (value.name.surname) {
      nameParts.push(value.name.surname);
    }
    if (value.name.suffix) {
      nameParts.push(value.name.suffix);
    }
  }

  return nameParts.join(' ');
}
