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

export function pxToNumber(pxVal: string): number {
  return parseFloat(pxVal.slice(0, -2));
}

export function isMouseEvent(e: Event): e is MouseEvent {
  return e.type.startsWith('mouse');
}

export function isTouchEvent(e: Event): e is TouchEvent {
  return e.type.startsWith('touch');
}
