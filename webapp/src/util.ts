import { Moment } from 'moment';

export function momentComparator(a?: Moment, b?: Moment) {
  if (!a && !b) {
    return 0;
  } else if (!b) {
    return -1;
  } else if (!a) {
    return 1;
  } else if (a.isBefore(b)) {
    return -1;
  } else if (a.isAfter(b)) {
    return 1;
  } else {
    return 0;
  }
}
