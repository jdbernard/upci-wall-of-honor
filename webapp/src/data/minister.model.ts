import { default as moment, Moment } from 'moment';
import { uuid } from '@cfworker/uuid';

export interface Photo {
  uri?: string;
  widthInPx?: number;
  heightInPx?: number;
  xOffsetInPx?: number;
  yOffsetInPx?: number;
}

export interface Name {
  given: string;
  surname?: string;
  prefix?: string;
  suffix?: string;
  additional: string[];
}

interface MinisterBase {
  id: string;
  slug: string;
  state: 'published' | 'draft' | 'archived';
  name: Name;
  isDeceased: boolean;
  ootfYearInducted?: number;
  details?: {
    photo: Photo;
    biography: string;
  };
}

export function newMinister(): Minister {
  return {
    id: uuid(),
    isDeceased: true,
    name: {
      given: 'John',
      additional: ['Q.'],
      surname: 'Minister'
    },
    slug: 'john-q-minister',
    state: 'draft'
  };
}

export const DATE_FORMAT = 'YYYY-MM-DD';

export interface Minister extends MinisterBase {
  dateOfBirth?: Moment;
  dateOfDeath?: Moment;
}

export interface MinisterDTO extends MinisterBase {
  dateOfBirth?: string;
  dateOfDeath?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDTO(dto: MinisterDTO): Minister {
  const m: Minister = { ...(dto as MinisterBase) };
  if (dto.dateOfBirth) {
    m.dateOfBirth = moment(dto.dateOfBirth);
  }
  if (dto.dateOfDeath) {
    m.dateOfDeath = moment(dto.dateOfDeath);
  }

  return m;
}

export function toDTO(m: Minister): MinisterDTO {
  const dto: MinisterDTO = { ...(m as MinisterBase) };
  if (m.dateOfBirth) {
    dto.dateOfBirth = m.dateOfBirth.format(DATE_FORMAT);
  }
  if (m.dateOfDeath) {
    dto.dateOfDeath = m.dateOfDeath.format(DATE_FORMAT);
  }

  return dto;
}

export function clone(m: Minister): Minister {
  return fromDTO(JSON.parse(JSON.stringify(toDTO(m))));
}

export function exactEquals(a: Minister | null, b: Minister | null): boolean {
  if (a !== null && b !== null) {
    return JSON.stringify(toDTO(a)) === JSON.stringify(toDTO(b));
  } else {
    return a === b;
  }
}
