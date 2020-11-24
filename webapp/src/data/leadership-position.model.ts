export const GENERAL_OFFICIALS_MINISTRY = 'General Officials';

export interface LeadershipPosition {
  id: string;
  ministerId: string;
  ministryName?: string;
  title: string;
  sortOrder: number;
}

export function deepClone(lp: LeadershipPosition): LeadershipPosition {
  return { ...lp };
}

export function exactEquals(
  a: LeadershipPosition | null,
  b: LeadershipPosition | null
): boolean {
  if (a !== null && b !== null) {
    return JSON.stringify(a) === JSON.stringify(b);
  } else {
    return a === b;
  }
}
