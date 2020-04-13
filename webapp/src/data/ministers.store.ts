import { default as Axios, AxiosInstance } from 'axios';
import { Minister } from '@/data/minister.model';
import moment from 'moment';

export class MinistersStore {
  constructor() {
    this.http = Axios.create({});
  }

  private _ministers?: Promise<Minister[]>;
  private http: AxiosInstance;

  public get ministers(): Promise<Minister[]> {
    if (!this._ministers) {
      this._ministers = this.loadMinisters();
    }

    return this._ministers;
  }

  private async loadMinisters(): Promise<Minister[]> {
    const resp = await this.http.get('/data/ministers.json');
    return resp.data.ministers.map(this.ministerFromJson);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ministerFromJson(json: any): Minister {
    const result: Minister = { ...json };
    result.dateOfBirth = moment(result.dateOfBirth);
    if (result.dateOfDeath) {
      result.dateOfDeath = moment(result.dateOfDeath);
    }

    return result;
  }
}

export default new MinistersStore();
