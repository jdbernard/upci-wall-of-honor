import { Route } from 'vue-router';
import { logService } from '@/services/logging';

export type SearchType = 'none' | 'by-name' | 'by-year';

export interface SearchState {
  type: SearchType;
  value?: string | null;
}

const psqlog = logService.getLogger('/searchparseSearchQuery');
export function parseSearchQuery(route: Route): SearchState {
  console.log(route.query);
  psqlog.trace(route.query);

  let result: SearchState = { type: 'none' };
  if (route.query?.name) {
    result = {
      type: 'by-name',
      value: route.query.name as string
    };
  } else if (route.query?.year) {
    result = {
      type: 'by-year',
      value: route.query.year as string
    };
  }

  psqlog.trace(result);
  return result;
}

const tqlog = logService.getLogger('/search/toQuery');
export function toQuery(search: SearchState): { [key: string]: string | null } {
  tqlog.trace(search);

  if (search.type === 'by-year') {
    return { year: search.value || null };
  } else if (search.type === 'by-name') {
    return { name: search.value || null };
  } else {
    return {};
  }
}
