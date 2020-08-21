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
  isDeceased: boolean;
  dateOfBirth?: Moment;
  dateOfDeath?: Moment;
  ootfYearInducted?: number;
  details?: {
    photo: {
      uri: string;
      widthInPx?: number;
      heightInPx?: number;
      xOffsetInPx?: number;
      yOffsetInPx?: number;
    };
    biography: string;
  };
}
