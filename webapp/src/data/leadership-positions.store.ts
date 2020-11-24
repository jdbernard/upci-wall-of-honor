import { AxiosInstance } from 'axios';
import { List } from 'immutable';
import { ReplaySubject, Observable } from 'rxjs';
import { logService } from '@jdbernard/logging';
import { LeadershipPosition } from '@/data/leadership-position.model';
import { default as apiHttp, fetchAllPages } from '@/data/api-client';

const logger = logService.getLogger('/data/leadership-positions.store');

export class LeadershipPositionsStore {
  private http: AxiosInstance;
  private initialLoad = true;
  private _leaders = List<LeadershipPosition>();
  private _leaders$ = new ReplaySubject<List<LeadershipPosition>>(1);

  constructor(http: AxiosInstance) {
    this.http = http;
    this._leaders$.subscribe(list => (this._leaders = list));
  }

  public get leadershipPositions$(): Observable<List<LeadershipPosition>> {
    if (this.initialLoad) {
      this.fetchLeadershipPositions();
      this.initialLoad = false;
    }
    return this._leaders$;
  }

  public async fetchLeadershipPositions() {
    logger.trace({ function: 'fetchLeadershipPositions' });

    try {
      const pages = await fetchAllPages(this.http, '/leadership-positions');
      const newList = List<LeadershipPosition>(
        pages.reduce((acc, page) => acc.concat(page.leadershipPositions), [])
      );

      this._leaders$.next(newList);
    } catch (error) {
      logger.error({ function: 'fetchLeadershipPositions' });
      throw error;
    }
  }

  public async persistLeadershipPosition(
    p: LeadershipPosition
  ): Promise<LeadershipPosition> {
    logger.trace({ function: 'persisLeadershipPosition' });
    try {
      const response = await this.http.post('/leadership-positions', p);
      logger.trace({ function: 'persistMinister', response });

      const existingIdx = this._leaders.findIndex(x => x.id === p.id);
      if (existingIdx < 0) {
        this._leaders$.next(this._leaders.push(p));
      } else {
        this._leaders$.next(this._leaders.set(existingIdx, p));
      }

      return p;
    } catch (error) {
      logger.error({ function: 'persisLeadershipPosition', error });
      throw error;
    }
  }

  public async removeLeadershipPosition(p: LeadershipPosition): Promise<void> {
    logger.trace({ function: 'removeLeadershipPosition' });
    try {
      await this.http.delete('/leadership-positions/' + p.id);
      const idx = this._leaders.findIndex(x => x.id === p.id);
      this._leaders$.next(this._leaders.splice(idx, 1));
    } catch (error) {
      logger.error({ function: 'removeLeadershipPosition', error });
      throw error;
    }
  }
}

export default new LeadershipPositionsStore(apiHttp);
