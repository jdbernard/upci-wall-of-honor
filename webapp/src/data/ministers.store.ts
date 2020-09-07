import { AxiosInstance } from 'axios';
import { List } from 'immutable';
import { ReplaySubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Minister, fromDTO } from '@/data/minister.model';
import apiHttp from '@/data/api-client';

export class MinistersStore {
  constructor(http: AxiosInstance) {
    // (window as any).MinistersStore = this;
    this.http = http;
  }

  private http: AxiosInstance;
  private _ministers$ = new ReplaySubject<List<Minister>>(1);
  private hasInitialData = false;

  public get ministers$(): Observable<List<Minister>> {
    if (!this.hasInitialData) {
      this.hasInitialData = true;
      this.fetchMinisters();
    }
    return this._ministers$;
  }

  public async persistMinister(m: Minister): Promise<Minister> {
    // TODO: Add logic to actually persist the change via the API

    // Update our local cache of ministers
    this.ministers$.pipe(take(1)).subscribe(list => {
      const existingIdx = list.findIndex(x => x.id === m.id);
      if (existingIdx < 0) {
        this._ministers$.next(list.push(m));
      } else {
        this._ministers$.next(list.set(existingIdx, m));
      }
    });

    return m;
  }

  private async fetchMinisters() {
    const resp = await this.http.get('/data/ministers.json');
    this._ministers$.next(List(resp.data.ministers.map(fromDTO)));
  }
}

export default new MinistersStore(apiHttp);
