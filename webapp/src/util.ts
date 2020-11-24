import { Moment } from 'moment';
import { List, Map } from 'immutable';

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

function encode(str: string): string {
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16))
    .replace(/%2C/g, ',');
}

// Taken from vue-router/src/util/query.js and translated to Typescript
export function stringifyQuery(obj: { [key: string]: string }): string {
  const res = obj
    ? Object.keys(obj)
        .map(key => {
          const val = obj[key];

          if (val === undefined) {
            return '';
          }

          if (val === null) {
            return encode(key);
          }

          if (Array.isArray(val)) {
            const result: string[] = [];
            val.forEach(val2 => {
              if (val2 === undefined) {
                return;
              }
              if (val2 === null) {
                result.push(encode(key));
              } else {
                result.push(encode(key) + '=' + encode(val2));
              }
            });
            return result.join('&');
          }

          return encode(key) + '=' + encode(val);
        })
        .filter(x => x.length > 0)
        .join('&')
    : null;
  return res ? `?${res}` : '';
}

export function keyBy<
  K extends string | number | symbol,
  V extends Record<string, any> /* eslint-disable-line */
>(list: List<V>, propName: string): Map<K, List<V>> {
  const rawMap = {} as Record<K, V[]>;
  list.forEach(item => {
    const key: K = item[propName];
    if (!rawMap[key]) {
      rawMap[key] = [item];
    } else {
      rawMap[key].push(item);
    }
  });

  return Map<K, List<V>>().withMutations(map => {
    for (const key in rawMap) {
      map.set(key, List<V>(rawMap[key]));
    }
  });
}
