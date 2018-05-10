import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retryWhen';
import { environment } from '../../../environments/environment';
import { HttpRequestInterface } from './http-request.interface';


@Injectable()
export class HttpService {

  /**
   * Boolean used to enable/disable the mock usage
   */
  private areMocksEnabled = true;

  /**
   * String used to known the api base url
   */
  private apiBaseUrl = '';

  /**
   * String used to known the mock base url
   */
  private mockBaseUrl = 'assets/mocks/';

  /**
   * Number used to indicate the delay to wait before retry a failed networ call
   */
  private delayBeforeRetryNetworkCall = 2000;

  /**
   * Number used to indicate the number of attempts to retry a network call if it fails
   */
  private maxNumberOfAttemptForNetworkErrorCall = 3;

  constructor(
    private http: HttpClient
  ) {
    // Initializes the service on the base of the environment
    this.areMocksEnabled = environment.areMocksEnabled;
    this.apiBaseUrl = environment.apiBaseUrl;
    this.delayBeforeRetryNetworkCall = environment.delayBeforeRetryNetworkCall;
    this.maxNumberOfAttemptForNetworkErrorCall = environment.maxNumberOfAttemptForNetworkErrorCall;
  }

  /**
   * Returns the options configured for observing the entire response
   */
  private getBaseObserve(): any {
    return {
      observe: 'response'
    };
  }

  /**
   * Returns the options configured for sending the headers
   */
  private getBaseHeaders(authorizationToken?: Observable<string>): Observable<any> {
    // Defines the base headers
    let applicationHeaders = new HttpHeaders();
    applicationHeaders = applicationHeaders.append('Content-Type', 'application/json');
    // Declare the base header observable
    const baseHeaderObservable = Observable.of({
      headers: applicationHeaders
    });
    // If the authorization token observable is present,
    // uses it to obtain and put the authorization token into the headers
    return authorizationToken ?
      Observable.zip(
        authorizationToken,
        baseHeaderObservable,
        (first, second) => {
          second.headers = second.headers.append('Authorization', first);
        }
      ) :
      baseHeaderObservable;
  }

  /**
   * Handles generic errors during network requests.
   * It waits for a fixed delay before retry and
   * if in the worst case throw the error
   *
   * @param errors
   */
  private handleErrorsOnRequest(errors): Observable<any> {
    return errors
      .delay(this.delayBeforeRetryNetworkCall)
      .take(this.maxNumberOfAttemptForNetworkErrorCall)
      .switchMap(e => Observable.throw(e));
  }

  /**
   * Returns an observable built on a GET request
   *
   * @param httpRequest
   */
  public get(httpRequest: HttpRequestInterface): Observable<any> {
    const options = httpRequest.observingResponse ? this.getBaseObserve() : this.getBaseHeaders(httpRequest.authenticationToken);
    return this.http.get(
      this.areMocksEnabled ?
        this.mockBaseUrl + httpRequest.mockUrl :
        this.apiBaseUrl + httpRequest.apiUrl,
      options
    )
      .retryWhen(errors => this.handleErrorsOnRequest(errors));
  }

  /**
   * Returns an observable built on a POST request
   *
   * @param httpRequest
   */
  public post(httpRequest: HttpRequestInterface): Observable<any> {
    const options = httpRequest.observingResponse ? this.getBaseObserve() : this.getBaseHeaders(httpRequest.authenticationToken);
    const observable = this.areMocksEnabled ?
      this.http.get(
        this.mockBaseUrl + httpRequest.mockUrl,
        options
      ) :
      this.http.post(
        this.apiBaseUrl + httpRequest.apiUrl,
        httpRequest.body,
        options
      );
    return observable
      .retryWhen(errors => this.handleErrorsOnRequest(errors));
  }

  /**
   * Returns an observable built on a POST request
   *
   * @param httpRequest
   */
  public put(httpRequest: HttpRequestInterface): Observable<any> {
    const options = httpRequest.observingResponse ? this.getBaseObserve() : this.getBaseHeaders(httpRequest.authenticationToken);
    const observable = this.areMocksEnabled ?
      this.http.get(
        this.mockBaseUrl + httpRequest.mockUrl,
        options
      ) :
      this.http.put(
        this.apiBaseUrl + httpRequest.apiUrl,
        httpRequest.body,
        options
      );
    return observable
      .retryWhen(errors => this.handleErrorsOnRequest(errors));
  }

  /**
   * Returns an observable built on a POST request
   *
   * @param httpRequest
   */
  public delete(httpRequest: HttpRequestInterface): Observable<any> {
    const options = httpRequest.observingResponse ? this.getBaseObserve() : this.getBaseHeaders(httpRequest.authenticationToken);
    const observable = this.areMocksEnabled ?
      this.http.get(
        this.mockBaseUrl + httpRequest.mockUrl,
        options
      ) :
      this.http.delete(
        this.apiBaseUrl + httpRequest.apiUrl,
        options
      );
    return observable
      .retryWhen(errors => this.handleErrorsOnRequest(errors));
  }

}
