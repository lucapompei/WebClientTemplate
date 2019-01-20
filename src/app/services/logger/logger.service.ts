import { Injectable } from '@angular/core';
import { LogLevelEnum } from './log-level-enum';

import { environment } from '../../../environments/environment';

/**
 * The logger service
 */
@Injectable()
export class LoggerService {

  /**
   * The minimum log level able to write on console
   */
  private minAcceptedLogLevel: LogLevelEnum = LogLevelEnum.TRACE;

  constructor() {
    if (environment.logLevel) {
      this.minAcceptedLogLevel = environment.logLevel;
    }
  }

  /**
   * Logs message in ERROR mode
   *
   * @param message
   * @param params
   */
  public error(message: any, ...params: any[]) {
    this.writeLog(LogLevelEnum.ERROR, message, params);
  }

  /**
   * Logs message in INFO mode
   *
   * @param message
   * @param params
   */
  public info(message: any, ...params: any[]) {
    this.writeLog(LogLevelEnum.INFO, message, params);
  }

  /**
   * Logs message in DEBUG mode
   *
   * @param message
   * @param params
   */
  public debug(message: any, ...params: any[]) {
    this.writeLog(LogLevelEnum.DEBUG, message, params);
  }

  /**
   * Logs message in WARN mode
   *
   * @param message
   * @param params
   */
  public warn(message: any, ...params: any[]) {
    this.writeLog(LogLevelEnum.WARN, message, params);
  }

  /**
   * Logs message in TRACE mode
   *
   * @param message
   * @param params
   */
  public trace(message: any, ...params: any[]) {
    this.writeLog(LogLevelEnum.TRACE, message, params);
  }

  /**
   * Write the given message, with the given params, in the given log level
   *
   * @param currentLevel
   * @param message
   * @param params
   */
  private writeLog(currentLevel: LogLevelEnum, message: any, ...params: any[]) {
    if (currentLevel >= this.minAcceptedLogLevel) {
      console.log('[' + LogLevelEnum[currentLevel] + '] ' + message, params);
    }
  }

}
