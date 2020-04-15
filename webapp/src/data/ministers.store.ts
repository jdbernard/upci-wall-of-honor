/* eslint-disable no-prototype-builtins */
import { default as Axios, AxiosInstance } from 'axios';
import { List, Map } from 'immutable';
import { Minister } from '@/data/minister.model';
import moment from 'moment';

export class MinistersStore {
  constructor() {
    this.http = Axios.create({});
  }

  private _ministers?: Promise<List<Minister>>;
  private _deceasedMinistersByYear?: Promise<Map<number, List<Minister>>>;
  private http: AxiosInstance;

  public get ministers(): Promise<List<Minister>> {
    if (!this._ministers) {
      this._ministers = this.loadMinisters();
    }

    return this._ministers;
  }

  public get deceasedMinistersByYear(): Promise<Map<number, List<Minister>>> {
    if (!this._deceasedMinistersByYear) {
      this._deceasedMinistersByYear = this.loadDeceasedMinistersByYear();
    }

    return this._deceasedMinistersByYear;
  }

  private async loadMinisters(): Promise<List<Minister>> {
    const resp = await this.http.get('/data/ministers.json');
    return List(resp.data.ministers.map(this.ministerFromJson));
  }

  // prettier-ignore
  private async loadDeceasedMinistersByYear(): Promise<Map<number, List<Minister>>> {
    const resp = await this.http.get('/data/deceased-ministers.view.json');
    return Map<number, List<Minister>>().withMutations(map => {
      for (const year in resp.data) {
        if (resp.data.hasOwnProperty(year)) {
          map.set(parseInt(year), resp.data[year].map(this.ministerFromJson));
        }
      }
    });
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
