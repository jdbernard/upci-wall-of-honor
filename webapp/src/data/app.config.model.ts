import { LogLevel } from '@jdbernard/logging';

export interface AppConfig {
  loggingLevel: LogLevel;
  pageDurationSeconds: number;
  userInactivityDurationSeconds: number;
  apiBaseUrl: string;
}

export const defaultConfig: AppConfig = {
  loggingLevel: LogLevel.WARN,
  pageDurationSeconds: 60 * 5,
  userInactivityDurationSeconds: 10,
  apiBaseUrl: ''
};
