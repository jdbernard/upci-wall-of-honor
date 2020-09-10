import { Minister } from '@/data/minister.model';
import { nameDisplay } from '@/filters/name-display.filter';
import moment from 'moment';

describe('nameDisplay filter', () => {
  const fullExample: Minister = {
    id: '0e005523-a61c-4510-808c-e69409133ce7',
    isDeceased: false,
    slug: 'john-g-m-smith',
    state: 'published',
    dateOfBirth: moment(),
    name: {
      given: 'John',
      surname: 'Smith',
      prefix: 'Rev.',
      suffix: 'Jr.',
      additional: ['G', 'M']
    }
  };

  const allFieldsMissing: Minister = {
    id: '9724883d-a600-4dcc-942d-ce3d2be3b603',
    isDeceased: false,
    slug: 'bob',
    state: 'published',
    dateOfBirth: moment(),
    name: {
      additional: [],
      given: 'Bob'
    }
  };

  const someFieldsMissing: Minister = {
    id: 'efd937fe-bed0-4594-a41a-f877f527c8d7',
    isDeceased: false,
    slug: 'dr-charles',
    state: 'published',
    dateOfBirth: moment(),
    name: {
      prefix: 'Dr.',
      additional: [],
      given: 'Charles'
    }
  };

  it('correctly formats short names', () => {
    expect(nameDisplay(fullExample)).toEqual('John G M Smith Jr.');
  });

  it('correctly formats full names', () => {
    expect(nameDisplay(fullExample, 'full')).toEqual('Rev. John G M Smith Jr.');
  });

  it('correctly handles missing fields in short names', () => {
    expect(nameDisplay(allFieldsMissing)).toEqual('Bob');
    expect(nameDisplay(allFieldsMissing, 'full')).toEqual('Bob');
  });

  it('correctly handles partial fields', () => {
    expect(nameDisplay(someFieldsMissing)).toEqual('Charles');
    expect(nameDisplay(someFieldsMissing, 'full')).toEqual('Dr. Charles');
  });
});
