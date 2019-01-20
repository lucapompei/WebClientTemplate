import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserCredentials } from '../../interfaces/user-credentials.interface';
import { EventBusService } from '../event-bus/event-bus.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../storage/storage.service';
import { StorageTypeEnum } from '../storage/storage-type.enum';
import { StorageKeys } from '../storage/storageKeys';
import { HttpService } from '../http/http.service';
import { HttpRequestInterface } from '../http/http-request.interface';
import { DialogRequestInterface } from '../../components/common/dialog/dialog-request.interface';

/**
 * Service used to handle the server APIs
 */
@Injectable()
export class NetworkService {

  /**
   * The JWT Helper Service
   */
  private jwtHelperService: JwtHelperService;

  /**
   * The user credentials used to authentication purpose
   */
  private userCredentials: UserCredentials = null;

  /**
   * The authentication token
   */
  private authenticationToken: string = null;

  /**
   * Boolean used to enable/disable the mock usage
   */
  private areMocksEnabled = true;

  /**
   * Boolean used to force a fake/mocked login
   */
  private isFakeLoginEnabled = false;

  constructor(
    private httpService: HttpService,
    private eventBusService: EventBusService,
    private storageService: StorageService
  ) {
    // Initializes the service on the base of the environment
    this.areMocksEnabled = environment.areMocksEnabled;
    // Initializes the service if some data are previously stored in session
    this.initializeAuthentication();
  }

  /**
   * Initializes the service if some data are previously stored in session
   */
  private initializeAuthentication(): void {
    // Initializes the JWT Helper Service
    this.jwtHelperService = new JwtHelperService();
    // Gets values from session if they exist
    const savedUserCredentials = this.storageService.retrieveOrGetDefault(
      StorageKeys.userCredentialsKey,
      null,
      StorageTypeEnum.SESSION_STORAGE
    );
    const savedAuthenticationToken = this.storageService.retrieveOrGetDefault(
      StorageKeys.authenticationTokenKey,
      null,
      StorageTypeEnum.SESSION_STORAGE
    );
    // Updates the authentication info
    if (savedUserCredentials != null && savedAuthenticationToken != null) {
      this.userCredentials = savedUserCredentials;
      this.authenticationToken = savedAuthenticationToken;
    }
  }

  /**
   * Configures the service setting the authentication token and
   * the user credentials used to refresh the first if it is necessary
   *
   * @param usercredentials
   * @param authenticationToken
   */
  private configureAuthentication(userCredentials?: UserCredentials, authenticationToken?: string): void {
    // Updates authorization info setting or removing them
    this.userCredentials = userCredentials ? userCredentials : null;
    this.authenticationToken = authenticationToken ? authenticationToken : null;
    // Updates the session info
    this.updateAuthenticationInfoInSession();
  }

  /**
   * Stores or updates the authentication info in session
   *
   * @param usercredentials
   * @param authenticationToken
   */
  private updateAuthenticationInfoInSession(): void {
    if (this.userCredentials != null && this.authenticationToken != null) {
      // Updates the authentication info in session
      this.storageService.store(StorageKeys.userCredentialsKey, this.userCredentials, StorageTypeEnum.SESSION_STORAGE);
      this.storageService.store(StorageKeys.authenticationTokenKey, this.authenticationToken, StorageTypeEnum.SESSION_STORAGE);
    } else {
      // Removes the authentication info from session
      this.storageService.remove(StorageKeys.userCredentialsKey, StorageTypeEnum.SESSION_STORAGE);
      this.storageService.remove(StorageKeys.authenticationTokenKey, StorageTypeEnum.SESSION_STORAGE);
    }
  }

  /**
   * Returns the authentication status,
   * checking the existence of a valid authentication token
   */
  public isAuthenticated(): Observable<boolean> {
    return this.getAuthenticationToken()
      .pipe(map(response => response != null));
  }

  /**
   * Returns the current authentication token,
   * refreshing it if it is necessary
   *
   * @param forceToLoginIfExpired
   */
  public getAuthenticationToken(forceToLoginIfExpired?: boolean): Observable<string> {
    if (this.authenticationToken == null) {
      return of(null);
    } else {
      // Checks whether the authentication token must be refreshed
      // and returns it
      return this.refreshAuthenticationTokenIfNecessary()
        .pipe(
          map(response => {
            if (this.authenticationToken == null && forceToLoginIfExpired) {
              // The authentication token is not valid or expired,
              // so the user is redirect to the first page before the login,
              // to allow a new login
              this.eventBusService.changeAuthenticationStatus(false);
            }
            return this.authenticationToken;
          })
        );
    }
  }

  /**
   * Updates the authentication token if it is necessary
   */
  private refreshAuthenticationTokenIfNecessary(): Observable<any> {
    if (this.userCredentials != null && this.authenticationToken != null) {
      if (!this.areMocksEnabled && !this.isFakeLoginEnabled && this.jwtHelperService.isTokenExpired(this.authenticationToken)) {
        // Observable for silently request the authentication token update
        return this.login(this.userCredentials, true);
      }
    }
    return of(true);
  }

  /**
   * Checks if the server is alive or not
   */
  public isServerAlive(): Observable<boolean> {
    const httpRequest: HttpRequestInterface = {
      mockUrl: 'info/isAlive.json',
      apiUrl: 'api/info/isAlive',
    };
    return this.httpService.get(httpRequest);
  }

  /**
   * Checks if the server is alive or not
   */
  public login(userCredentials: UserCredentials, isSilent?: boolean): Observable<any> {
    const httpRequest: HttpRequestInterface = {
      mockUrl: 'login.json',
      apiUrl: 'login',
      body: userCredentials,
      observingResponse: true,
      isForcedMock: this.isFakeLoginEnabled
    };
    const observable = this.httpService.post(httpRequest);
    return observable
      .pipe(
        map(response => {
          // Checks if login is successfully done or not
          if (response && response.status === 200) {
            let authenticationToken = null;
            if (this.areMocksEnabled || this.isFakeLoginEnabled) {
              // Using mock, gets the authentication token via body
              authenticationToken = response.body['Authorization'];
            } else {
              // Using real endpoint, gets the authentication token via headers
              authenticationToken = response.headers.get('Authorization');
            }
            if (authenticationToken == null) {
              return this.handleErrorLogin(isSilent, userCredentials, false);
            }
            if (!isSilent) {
              // If the login is not silent, asks to emit the authentication status change
              this.eventBusService.changeAuthenticationStatus(true);
            }
            // Configures the authenticator service through the received authentication token
            this.configureAuthentication(userCredentials, authenticationToken);
            // Login is successfully done
            return true;
          } else {
            return this.handleErrorLogin(isSilent, userCredentials, false);
          }
        }),
        catchError(error => {
          return this.handleErrorLogin(isSilent, userCredentials, error);
        })
      );
  }

  private handleErrorLogin(isSilent: boolean, userCredentials: UserCredentials, error: any): Observable<any> {
    // Configures the authenticator after login failure
    this.configureAuthentication(userCredentials, null);
    // Login is not sucessfully done
    this.eventBusService.changeAuthenticationStatus(false);
    if (!isSilent) {
      const dialogRequest: DialogRequestInterface = {
        title: 'login',
        message: 'login_failed'
      };
      this.eventBusService.sendDialogRequest(dialogRequest);
    }
    return Observable.throw(error);
  }

  /**
   * Checks if the server is alive or not
   */
  public logout(): Observable<any> {
    // Configures the authenticator service re-initializing its authentication info
    this.configureAuthentication();
    // Emits event to signal the logout
    this.eventBusService.changeAuthenticationStatus(false);
    // Logout is successfully done
    return of(true);
  }

}
