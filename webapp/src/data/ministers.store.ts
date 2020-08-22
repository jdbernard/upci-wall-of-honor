/* eslint-disable no-prototype-builtins */
import { default as Axios, AxiosInstance } from 'axios';
import { List, Map } from 'immutable';
import { Minister } from '@/data/minister.model';
import moment from 'moment';

export class MinistersStore {
  constructor() {
    this.http = Axios.create({});
  }

  private _allMinisters?: Promise<List<Minister>>;
  private _ministers?: Promise<List<Minister>>;
  private _deceasedMinistersByYear?: Promise<Map<number, List<Minister>>>;
  private http: AxiosInstance;

  public get ministers(): Promise<List<Minister>> {
    if (!this._ministers) {
      this._allMinisters = this.loadMinisters();
      this._ministers = this.loadMinisters().then(allMinisters =>
        allMinisters.filter(m => m.state === 'published')
      );
    }

    return this._ministers;
  }

  private async loadMinisters(): Promise<List<Minister>> {
    const resp = await this.http.get('/data/ministers.json');
    return List(resp.data.ministers.map(this.ministerFromJson));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ministerFromJson(json: any): Minister {
    const result: Minister = { ...json };
    if (result.dateOfBirth) {
      result.dateOfBirth = moment(result.dateOfBirth);
    }
    if (result.dateOfDeath) {
      result.dateOfDeath = moment(result.dateOfDeath);
    }

    return result;
  }
}

export default new MinistersStore();
