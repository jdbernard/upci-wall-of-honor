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

export type RecordState = 'published' | 'draft' | 'archived';

export const RECORD_STATES: RecordState[] = ['published', 'draft', 'archived'];

interface MinisterBase {
  id: string;
  slug: string;
  state: RecordState;
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

export function deepClone(m: Minister): Minister {
  const clone = {
    ...m,
    name: {
      ...m.name,
      additional: m.name.additional.slice()
    }
  };

  if (m.details) {
    clone.details = {
      ...m.details,
      photo: { ...m.details.photo }
    };
  }

  return clone;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDTO(dto: MinisterDTO): Minister {
  // deep clone the DTO
  const m: Minister = JSON.parse(JSON.stringify(dto));

  // transform necessary fields
  if (m.dateOfBirth) {
    m.dateOfBirth = moment(m.dateOfBirth);
  }
  if (m.dateOfDeath) {
    m.dateOfDeath = moment(m.dateOfDeath);
  }

  return m;
}

export function toDTO(m: Minister): MinisterDTO {
  // deep clone the minister object
  const mCopy = deepClone(m);
  const dto: MinisterDTO = { ...(mCopy as MinisterBase) };

  // transform necessary fields
  if (mCopy.dateOfBirth) {
    dto.dateOfBirth = mCopy.dateOfBirth.format(DATE_FORMAT);
  }
  if (mCopy.dateOfDeath) {
    dto.dateOfDeath = mCopy.dateOfDeath.format(DATE_FORMAT);
  }

  return dto;
}

export function exactEquals(a: Minister | null, b: Minister | null): boolean {
  if (a !== null && b !== null) {
    return JSON.stringify(toDTO(a)) === JSON.stringify(toDTO(b));
  } else {
    return a === b;
  }
}
