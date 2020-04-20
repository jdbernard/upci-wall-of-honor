import { LogLevel } from '@/services/logging';

export interface AppConfig {
  userInactivityDurationSeconds: number;
  loggingLevel: LogLevel;
}

export const defaultConfig: AppConfig = {
  userInactivityDurationSeconds: 10,
  loggingLevel: LogLevel.WARN
};
