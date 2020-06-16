import { LogLevel } from '@/services/logging';

export interface AppConfig {
  loggingLevel: LogLevel;
  pageDurationSeconds: number;
  userInactivityDurationSeconds: number;
}

export const defaultConfig: AppConfig = {
  loggingLevel: LogLevel.WARN,
  pageDurationSeconds: 60 * 5,
  userInactivityDurationSeconds: 10
};
