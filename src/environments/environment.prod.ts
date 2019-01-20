import { LogLevelEnum } from '../app/services/logger/log-level-enum';

export const environment = {
  production: true,
  appVersion: require('../../package.json').version,
  logLevel: LogLevelEnum.INFO,
  storageSecretKey: 'WebClientTemplateSecretKey',
  areMocksEnabled: false,
  apiPort: ':8080/',
  delayBeforeRetryNetworkCall: 2000,
  maxNumberOfAttemptForNetworkErrorCall: 3,
  firstPageBeforeLogin: '/login',
  firstPageAfterLogin: ''
};
