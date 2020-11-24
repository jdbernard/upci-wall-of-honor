import { AxiosInstance } from 'axios';
import { List } from 'immutable';
import { ReplaySubject, Observable } from 'rxjs';
import { logService } from '@jdbernard/logging';
import { BoardCategory } from '@/data/board-category.model';
import { default as apiHttp, fetchAllPages } from '@/data/api-client';

const logger = logService.getLogger('/data/board-categories.store');

export class BoardCategoriesStore {
  private http: AxiosInstance;
  private initialLoad = true;
  private _categories = List<BoardCategory>();
  private _categories$ = new ReplaySubject<List<BoardCategory>>(1);

  constructor(http: AxiosInstance) {
    this.http = http;
    this._categories$.subscribe(list => (this._categories = list));
  }

  public get boardCategories$(): Observable<List<BoardCategory>> {
    if (this.initialLoad) {
      this.fetchBoardCategories();
      this.initialLoad = false;
    }
    return this._categories$;
  }

  public async fetchBoardCategories() {
    logger.trace({ function: 'fetchBoardCategories' });

    try {
      const pages = await fetchAllPages(this.http, '/general-board/categories');
      const newList = List<BoardCategory>(
        pages.reduce((acc, page) => acc.concat(page.boardCategories), [])
      );

      this._categories$.next(newList);
    } catch (error) {
      logger.error({ function: 'fetchBoardCategories' });
      throw error;
    }
  }

  public async persistBoardCategory(
    cat: BoardCategory
  ): Promise<BoardCategory> {
    logger.trace({ function: 'persisBoardCategory' });
    try {
      const response = await this.http.post('/general-board/categories', cat);
      logger.trace({ function: 'persistMinister', response });

      const existingIdx = this._categories.findIndex(x => x.id === cat.id);
      if (existingIdx < 0) {
        this._categories$.next(this._categories.push(cat));
      } else {
        this._categories$.next(this._categories.set(existingIdx, cat));
      }

      return cat;
    } catch (error) {
      logger.error({ function: 'persisBoardCategory', error });
      throw error;
    }
  }
}

export default new BoardCategoriesStore(apiHttp);
