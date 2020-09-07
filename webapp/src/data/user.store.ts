import { AxiosInstance } from 'axios';
import { ReplaySubject } from 'rxjs';
import apiHttp from '@/data/api-client';
import { User } from '@/data/user.model';

export class UserStore {
  constructor(http: AxiosInstance) {
    this.http = http;

    this.loadInitialUser();
  }

  private http: AxiosInstance;

  public user$ = new ReplaySubject<User | null>(1);
  public isAuthenticated$ = new ReplaySubject<boolean>(1);

  private async loadInitialUser() {
    this.user$.next(null);
    this.isAuthenticated$.next(false);
  }
}
export default new UserStore(apiHttp);
