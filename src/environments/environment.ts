import { LogLevelEnum } from '../app/services/logger/log-level-enum';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: require('../../package.json').version,
  logLevel: LogLevelEnum.DEBUG,
  storageSecretKey: '',
  areMocksEnabled: true,
  apiPort: ':8080/',
  delayBeforeRetryNetworkCall: 2000,
  maxNumberOfAttemptForNetworkErrorCall: 3,
  firstPageBeforeLogin: '/login',
  firstPageAfterLogin: ''
};
