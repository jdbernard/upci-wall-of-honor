import { User } from '@/data/user.model';

export interface OktaAuth {
  isAuthenticated: () => Promise<boolean>;
  getUser: () => Promise<User>;
  getAccessToken: () => Promise<string>;
}

export class UserStore {
  private auth: OktaAuth | null = null;

  public setAuth(auth: OktaAuth) {
    this.auth = auth;
  }

  public async isAuthenticated(): Promise<boolean> {
    if (!this.auth) return false;
    return this.auth.isAuthenticated();
  }

  public async getUser(): Promise<User | null> {
    if (!this.auth) return null;
    return this.auth.getUser();
  }

  public async getAccessToken(): Promise<string | null> {
    if (!this.auth) return null;
    return this.auth.getAccessToken();
  }
}

export default new UserStore();
