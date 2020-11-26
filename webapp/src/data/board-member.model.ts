import { uuid } from '@cfworker/uuid';

export interface BoardMember {
  id: string;
  name: string;
  title?: string;
  categoryId: string;
}

export function newBoardMember(): BoardMember {
  return {
    id: uuid(),
    name: '',
    categoryId: ''
  };
}

export function deepClone(bm: BoardMember): BoardMember {
  return { ...bm };
}

export function exactEquals(
  a: BoardMember | null,
  b: BoardMember | null
): boolean {
  if (a !== null && b !== null) {
    return JSON.stringify(a) === JSON.stringify(b);
  } else {
    return a === b;
  }
}
