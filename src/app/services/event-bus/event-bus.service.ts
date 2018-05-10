import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserCredentials } from '../../interfaces/user-credentials.interface';

@Injectable()
export class EventBusService {

  /**
   * The event that signals the authentication status changes
   */
  @Output() authenticationStatusEvent: EventEmitter<any> = new EventEmitter();

  /**
   * The event that signals the loader visibility changes
   */
  @Output() loaderVisibilityEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  /**
   * Emits the event to signal the authentication status change
   *
   * @param status
   */
  public changeAuthenticationStatus(status: boolean): void {
    this.authenticationStatusEvent.emit(status);
  }

  /**
   * Emits the event to signal the loader visibility change
   *
   * @param status
   */
  public changeLoadingVisibility(status: boolean): void {
    this.loaderVisibilityEvent.emit(status);
  }

}
