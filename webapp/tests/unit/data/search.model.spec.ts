import { Route } from 'vue-router';
import { parseSearchQuery, SearchState } from '@/data/search.model';

describe('search.model', () => {
  it('handles empty queries ', () => {
    expect(parseSearchQuery(({} as unknown) as Route)).toEqual({
      type: 'none'
    });
  });

  it('parses Vue query parameters for year values', () => {
    const query = { year: '1972' };
    const search: SearchState = { type: 'by-year', value: '1972' };
    expect(parseSearchQuery(({ query } as unknown) as Route)).toEqual(search);
  });

  it('handles year query without value', () => {
    const query = { year: null };
    const search: SearchState = { type: 'by-year', value: null };
    expect(parseSearchQuery(({ query } as unknown) as Route)).toEqual(search);
  });

  it('parses Vue query parameters for name values', () => {
    const query = { name: 'Jack' };
    const search: SearchState = { type: 'by-name', value: 'Jack' };
    expect(parseSearchQuery(({ query } as unknown) as Route)).toEqual(search);
  });

  it('handles name query without value', () => {
    const query = { name: null };
    const search: SearchState = { type: 'by-name', value: null };
    expect(parseSearchQuery(({ query } as unknown) as Route)).toEqual(search);
  });
});
