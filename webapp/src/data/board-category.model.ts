import { uuid } from '@cfworker/uuid';

export interface BoardCategory {
  id: string;
  name: string;
  includeTitles: boolean;
  sortOrder: number;
}

export function newBoardCategory(): BoardCategory {
  return {
    id: uuid(),
    name: '',
    includeTitles: true,
    sortOrder: 0
  };
}

export function deepClone(cat: BoardCategory): BoardCategory {
  return { ...cat };
}

export function exactEquals(
  a: BoardCategory | null,
  b: BoardCategory | null
): boolean {
  if (a !== null && b !== null) {
    return JSON.stringify(a) === JSON.stringify(b);
  } else {
    return a === b;
  }
}
