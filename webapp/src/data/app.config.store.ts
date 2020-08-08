import { default as Axios, AxiosInstance } from 'axios';
import { AppConfig, defaultConfig } from './app.config.model';
import { logService, LogLevel } from '@jdbernard/logging';

const logger = logService.getLogger('/data/app.config.store');

export class AppConfigStore {
  constructor() {
    this.http = Axios.create({});
  }

  private _appConfig?: Promise<AppConfig>;
  private http: AxiosInstance;

  public get appConfig(): Promise<AppConfig> {
    if (!this._appConfig) {
      this._appConfig = this.loadAppConfig();
    }

    return this._appConfig;
  }

  private async loadAppConfig(): Promise<AppConfig> {
    try {
      const resp = await this.http.get('/data/app.config.json');
      const config = { ...defaultConfig, ...resp.data };

      config.loggingLevel = (LogLevel[
        config.loggingLevel
      ] as unknown) as LogLevel;

      return config;
    } catch (e) {
      logger.error('Unable to load application configuration: ' + e.message);
      logger.trace(e);
      return defaultConfig;
    }
  }
}

export default new AppConfigStore();
