import { LogLevelEnum } from '../app/services/logger/log-level-enum';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  logLevel: LogLevelEnum.DEBUG,
  storageSecretKey: '',
  areMocksEnabled: true,
  apiBaseUrl: 'http://localhost:8080/WebTemplate/',
  delayBeforeRetryNetworkCall: 2000,
  maxNumberOfAttemptForNetworkErrorCall: 3,
  firstPageBeforeLogin: '/login',
  firstPageAfterLogin: ''
};
