import { AxiosInstance } from 'axios';
import { List } from 'immutable';
import { ReplaySubject, Observable } from 'rxjs';
import { logService } from '@jdbernard/logging';
import { BoardMember } from '@/data/board-member.model';
import { default as apiHttp, fetchAllPages } from '@/data/api-client';

const logger = logService.getLogger('/data/board-members.store');

export class BoardMembersStore {
  private http: AxiosInstance;
  private initialLoad = true;
  private _members = List<BoardMember>();
  private _members$ = new ReplaySubject<List<BoardMember>>(1);

  constructor(http: AxiosInstance) {
    this.http = http;
    this._members$.subscribe(list => (this._members = list));
  }

  public get boardMembers$(): Observable<List<BoardMember>> {
    if (this.initialLoad) {
      this.fetchBoardMembers();
      this.initialLoad = false;
    }
    return this._members$;
  }

  public async fetchBoardMembers() {
    logger.trace({ function: 'fetchBoardMembers' });

    try {
      const pages = await fetchAllPages(this.http, '/general-board/members');
      const newList = List<BoardMember>(
        pages.reduce((acc, page) => acc.concat(page.boardMembers), [])
      );

      this._members$.next(newList);
    } catch (error) {
      logger.error({ function: 'fetchBoardMembers' });
      throw error;
    }
  }

  public async persistBoardMember(m: BoardMember): Promise<BoardMember> {
    logger.trace({ function: 'persisBoardMember' });
    try {
      const response = await this.http.post('/general-board/members', m);
      logger.trace({ function: 'persistMinister', response });

      const existingIdx = this._members.findIndex(x => x.id === m.id);
      if (existingIdx < 0) {
        this._members$.next(this._members.push(m));
      } else {
        this._members$.next(this._members.set(existingIdx, m));
      }

      return m;
    } catch (error) {
      logger.error({ function: 'persisBoardMember', error });
      throw error;
    }
  }

  public async removeBoardMember(p: BoardMember): Promise<void> {
    logger.trace({ function: 'removeBoardMember' });
    try {
      await this.http.delete('/board-members/' + p.id);
      const idx = this._members.findIndex(x => x.id === p.id);
      this._members$.next(this._members.splice(idx, 1));
    } catch (error) {
      logger.error({ function: 'removeBoardMember', error });
      throw error;
    }
  }
}

export default new BoardMembersStore(apiHttp);
