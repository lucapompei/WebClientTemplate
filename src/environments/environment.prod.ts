import { LogLevelEnum } from '../app/services/logger/log-level-enum';

/**
 
  production: a boolean indicating if the current environment is the production one
  appVersion: the application version number
  logLevel: the log level
  storageSecretKey: the key to use to encrypt storage
  areMocksEnabled: a boolean indicating if the mock are enabled
  apiBaseUrl: the api base url; if empty the hostname where the application is deployed will be used
  apiPort: the api port,
  delayBeforeRetryNetworkCall: the delay used to simulate api call when mocks are enabled
  maxNumberOfAttemptForNetworkErrorCall: the number of attempts to be made when api calls fail
  firstPageBeforeLogin: the first page to display before login
  firstPageAfterLogin: the first page to display after login
  defaultLanguage: the default language (according with assets/i18n/)

 */

export const environment = {
  production: true,
  appVersion: require('../../package.json').version,
  logLevel: LogLevelEnum.INFO,
  storageSecretKey: 'WebClientTemplateSecretKey',
  areMocksEnabled: false,
  apiBaseUrl: '',
  apiPort: ':8080/',
  delayBeforeRetryNetworkCall: 2000,
  maxNumberOfAttemptForNetworkErrorCall: 3,
  firstPageBeforeLogin: '/login',
  firstPageAfterLogin: '',
  defaultLanguage: 'en'
};
