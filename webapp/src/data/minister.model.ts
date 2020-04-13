import { Moment } from 'moment';

export interface Minister {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Moment;
  dateOfDeath?: Moment;
  details?: {
    thumbnailUri: string;
    photoUri: string;
    biography: string;
  };
}
