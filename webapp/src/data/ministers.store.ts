import { AxiosInstance } from 'axios';
import { List, Set } from 'immutable';
import { ReplaySubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { logService } from '@jdbernard/logging';
import { default as apiHttp, fetchAllPages } from '@/data/api-client';
import {
  Minister,
  fromDTO,
  RecordState,
  RECORD_STATES,
  toDTO
} from '@/data/minister.model';

const logger = logService.getLogger('/data/ministers.store');

export class MinistersStore {
  private http: AxiosInstance;
  private _ministers = List<Minister>();
  private _ministers$ = new ReplaySubject<List<Minister>>(1);
  private _livingMinistersWithBio$: null | Observable<List<Minister>> = null;

  private _ministersForState$: {
    [key: string]: Observable<List<Minister>>;
  } = {};

  constructor(http: AxiosInstance) {
    this.http = http;
    this._ministers$.subscribe(list => (this._ministers = list));
  }

  public get ministers$(): Observable<List<Minister>> {
    // If we haven't fetched ministers for all states, fetch all ministers.
    if (RECORD_STATES.some(state => !this._ministersForState$[state])) {
      this.fetchMinisters();

      // Add the observables for any states we haven't already created (as we
      // just fetched them all).
      RECORD_STATES.filter(state => !this._ministersForState$[state]).forEach(
        state =>
          (this._ministersForState$[state] = this._ministers$.pipe(
            map(l => l.filter(m => m.state === state))
          ))
      );
    }

    return this._ministers$;
  }

  public get livingMinistersWithBio$(): Observable<List<Minister>> {
    if (!this._livingMinistersWithBio$) {
      this._livingMinistersWithBio$ = this.ministers$.pipe(
        map(list => list.filter(m => !m.isDeceased && m.details))
      );
    }

    return this._livingMinistersWithBio$;
  }

  public getMinistersForState$(state: RecordState): Observable<List<Minister>> {
    if (!this._ministersForState$[state]) {
      this._ministersForState$[state] = this._ministers$.pipe(
        map(l => l.filter(m => m.state === state))
      );
      this.fetchMinisters(state);
    }

    return this._ministersForState$[state];
  }

  public async persistMinister(m: Minister): Promise<Minister> {
    const dto = toDTO(m);
    try {
      const response = await this.http.post('/ministers', dto);

      logger.trace({ function: 'persistMinister', response });

      // Update our local cache of ministers
      const existingIdx = this._ministers.findIndex(x => x.id === m.id);
      if (existingIdx < 0) {
        this._ministers$.next(this._ministers.push(m));
      } else {
        this._ministers$.next(this._ministers.set(existingIdx, m));
      }

      return m;
    } catch (error) {
      logger.error({ function: 'persistMinister', error });
      throw error;
    }
  }

  public async fetchMinisters(state?: RecordState) {
    logger.trace({ function: 'fetchMinisters', state });

    try {
      // Fetch and parse the ministers list
      const pages = await fetchAllPages(
        this.http,
        '/ministers' + (state ? `?state=${state}` : '')
      );
      const newList = List<Minister>(
        pages.reduce((acc, page) => acc.concat(page.ministers), []).map(fromDTO)
      );

      if (state) {
        // If we've pulled a specific state we need to merge it with our
        // existing dataset of ministers (who may be of a different state).
        const idSet = Set<string>(this._ministers.map(m => m.id));
        const netNewList = newList.filter(m => !idSet.includes(m.id));
        this._ministers$.next(this._ministers.concat(netNewList));
      } else {
        // If we didn't pull a specific state then we've got all of them, just
        // replace any existing dataset.
        this._ministers$.next(newList);
      }
    } catch (error) {
      logger.error({ function: 'fetchMinisters', state, error });
      throw error;
    }
  }
}

export default new MinistersStore(apiHttp);
