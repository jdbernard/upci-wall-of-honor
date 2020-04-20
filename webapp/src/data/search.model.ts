import { Route } from 'vue-router';

export type SearchType = 'none' | 'by-name' | 'by-year';

export interface SearchState {
  type: SearchType;
  value?: string | null;
}

export function parseSearchQuery(route: Route): SearchState {
  let result: SearchState = { type: 'none' };

  if (route.query) {
    if (route.query.name !== undefined) {
      result = {
        type: 'by-name',
        value: route.query.name as string
      };
    } else if (route.query.year !== undefined) {
      result = {
        type: 'by-year',
        value: route.query.year as string
      };
    }
  }

  return result;
}

export function toQuery(search: SearchState): { [key: string]: string | null } {
  if (search.type === 'by-year') {
    return { year: search.value || null };
  } else if (search.type === 'by-name') {
    return { name: search.value || null };
  } else {
    return {};
  }
}
