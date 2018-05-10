import { LogLevelEnum } from '../app/services/logger/log-level-enum';

export const environment = {
  production: true,
  logLevel: LogLevelEnum.INFO,
  storageSecretKey: 'WebClientTemplateSecretKey',
  areMocksEnabled: false,
  apiBaseUrl: 'http://localhost:8080/WebTemplate/',
  delayBeforeRetryNetworkCall: 2000,
  maxNumberOfAttemptForNetworkErrorCall: 3,
  firstPageBeforeLogin: '/login',
  firstPageAfterLogin: ''
};
