import {
  Minister,
  MinisterDTO,
  deepClone,
  exactEquals,
  fromDTO,
  toDTO
} from '@/data/minister.model';
import moment from 'moment';

const m: Minister = {
  id: '123',
  slug: 'john-q-brown',
  state: 'published',
  name: {
    given: 'John',
    surname: 'Brown',
    additional: ['Q.']
  },
  isDeceased: true,
  dateOfBirth: moment('1932-05-09'),
  dateOfDeath: moment('2005-11-28'),
  ootfYearInducted: 2009,
  details: {
    photo: {
      uri: 'https://image.com',
      widthInPx: 600,
      xOffsetInPx: 20,
      yOffsetInPx: 30
    },
    biography: 'John Brown is fictional'
  }
};

const m2: Minister = {
  id: '456',
  slug: 'jack-greene',
  state: 'published',
  name: {
    given: 'Jack',
    surname: 'Greene',
    additional: []
  },
  isDeceased: true,
  dateOfDeath: moment('1994-04-18')
};

const dto: MinisterDTO = {
  id: '123',
  slug: 'john-q-brown',
  state: 'published',
  name: {
    given: 'John',
    surname: 'Brown',
    additional: ['Q.']
  },
  isDeceased: true,
  dateOfBirth: '1932-05-09',
  dateOfDeath: '2005-11-28',
  ootfYearInducted: 2009,
  details: {
    photo: {
      uri: 'https://image.com',
      widthInPx: 600,
      xOffsetInPx: 20,
      yOffsetInPx: 30
    },
    biography: 'John Brown is fictional'
  }
};

describe('MinisterModel.deepClone', () => {
  it('creates independent but exactly equal objects', () => {
    const clone = deepClone(m);
    expect(clone).not.toBe(m);
    expect(clone.details).not.toBe(m.details);
    expect(clone.details?.photo).not.toBe(m.details?.photo);
    expect(clone.name).not.toBe(m.name);
    expect(clone.name.additional).not.toBe(m.name.additional);
    expect(clone).toEqual(m);
    expect(clone).not.toEqual(m2);
  });

  it('handles incomplete Minister objects', () => {
    const clone = deepClone(m2);
    expect(clone).not.toBe(m2);
    expect(clone.details).not.toBeDefined();
    expect(clone.name).not.toBe(m2.name);
    expect(clone).toEqual(m2);
  });
});

describe('MinisterModel.exactEquals', () => {
  it('recognized cloned objects as equal', () => {
    const clone = deepClone(m);
    expect(clone).toEqual(m);
    expect(exactEquals(clone, m)).toBeTruthy();
  });

  it('recognizes deep differences between objects', () => {
    const clone = deepClone(m);
    if (clone.details) {
      clone.details.photo.widthInPx = 590;
    }
    expect(exactEquals(clone, m)).not.toBeTruthy();
  });
});

describe('MinisterModel.toDTO', () => {
  it('creates an DTO that is independent of the model', () => {
    const createdDTO = toDTO(m);
    expect(createdDTO).toEqual(dto);
    expect(createdDTO).not.toBe(m);
    expect(createdDTO.details).not.toBe(m.details);
    expect(createdDTO.details?.photo).not.toBe(m.details?.photo);
    expect(createdDTO.name).not.toBe(m.name);
  });
});

describe('MinisterModel.fromDTO', () => {
  it('creates a model that is independent of the DTO', () => {
    const createdModel = fromDTO(dto);
    expect(createdModel).toEqual(m);
    expect(createdModel).not.toBe(dto);
    expect(createdModel.details).not.toBe(dto.details);
    expect(createdModel.details?.photo).not.toBe(dto.details?.photo);
    expect(createdModel.name).not.toBe(dto.name);
  });
});
