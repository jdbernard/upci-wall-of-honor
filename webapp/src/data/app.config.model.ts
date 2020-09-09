import { LogLevel } from '@jdbernard/logging';

export interface AppConfig {
  loggingLevel: LogLevel;
  pageDurationSeconds: number;
  userInactivityDurationSeconds: number;
  apiBaseUrl: string;
  auth: {
    loginUrl: string;
    clientId: string;
  };
  okta: {
    issuer: string;
    clientId: string;
    redirectUri: string;
    postLoginRedirectUri: string;
  };
}

export const defaultConfig: AppConfig = {
  loggingLevel: LogLevel.WARN,
  pageDurationSeconds: 60 * 5,
  userInactivityDurationSeconds: 10,
  apiBaseUrl: '',
  okta: {
    issuer: '',
    clientId: '',
    redirectUri: '/admin/login',
    postLoginRedirectUri: '/'
  },
  auth: {
    loginUrl: '',
    clientId: ''
  }
};
