import { Moment } from 'moment';

export interface Minister {
  id: string;
  slug: string;
  state: 'published' | 'draft' | 'archived';
  name: {
    given: string;
    surname?: string;
    prefix?: string;
    suffix?: string;
    additional?: string[];
  };
  dateOfBirth: Moment;
  dateOfDeath?: Moment;
  ootfYearInducted?: number;
  details?: {
    thumbnailUri: string;
    photoUri: string;
    biography: string;
  };
}
