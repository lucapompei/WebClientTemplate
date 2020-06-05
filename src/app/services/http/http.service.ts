import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, retryWhen, delay, take, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpRequestInterface } from './http-request.interface';

/**
 * Service used to handle each http request
 */
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
    if (environment.apiBaseUrl && environment.apiBaseUrl !== '') {
      this.apiBaseUrl = environment.apiBaseUrl;
    } else {
      this.apiBaseUrl = window.location.protocol + '//' + window.location.hostname;
    }
    this.apiBaseUrl += environment.apiPort;
    this.delayBeforeRetryNetworkCall = environment.delayBeforeRetryNetworkCall;
    this.maxNumberOfAttemptForNetworkErrorCall = environment.maxNumberOfAttemptForNetworkErrorCall;
  }

  /**
   *  Returns the base options
   *
   * @param httpRequest
   */
  private getBaseOptions(httpRequest: HttpRequestInterface): any {
    const options = {};
    if (httpRequest.observingResponse) {
      options['observe'] = 'response';
    }
    if (httpRequest.responseType) {
      options['responseType'] = httpRequest.responseType;
    }
    // Set headers
    if (httpRequest.customHeaders) {
      options['headers'] = httpRequest.customHeaders;
    } else {
      // Defines the base headers
      let applicationHeaders = new HttpHeaders();
      applicationHeaders = applicationHeaders.append('Content-type', 'application/json');
      options['headers'] = applicationHeaders;
    }
    return options;
  }

  /**
   * Returns the base projection
   *
   * @param response
   */
  private getBaseProjection(response: any): any {
    if (response) {
      if (response.hasOwnProperty('data')) {
        response = response['data'];
      } else if (response.body && response.body.hasOwnProperty('data')) {
        response.body = response.body['data'];
      }
    }
    return response;
  }

  /**
   * Handles generic errors during network requests.
   * It waits for a fixed delay before retry and
   * if in the worst case throw the error
   *
   * @param errors
   */
  private handleErrorsOnRequest(errors: any): Observable<any> {
    return errors.pipe(
      delay(this.delayBeforeRetryNetworkCall),
      take(this.maxNumberOfAttemptForNetworkErrorCall),
      switchMap((e: any) => throwError(e))
    );
  }

  /**
   * Returns an observable built on a GET request
   *
   * @param httpRequest
   */
  public get(httpRequest: HttpRequestInterface): Observable<any> {
    const options = this.getBaseOptions(httpRequest);
    const observable = this.http.get(
      this.areMocksEnabled || httpRequest.isForcedMock ?
        this.mockBaseUrl + httpRequest.mockUrl :
        this.apiBaseUrl + httpRequest.apiUrl,
      options);
    return observable
      .pipe(
        retryWhen((errors: any) => this.handleErrorsOnRequest(errors)),
        map((response: any) => this.getBaseProjection(response))
      );
  }

  /**
   * Returns an observable built on a POST request
   *
   * @param httpRequest
   */
  public post(httpRequest: HttpRequestInterface): Observable<any> {
    const options = this.getBaseOptions(httpRequest);
    const observable = this.areMocksEnabled || httpRequest.isForcedMock ?
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
      .pipe(
        retryWhen((errors: any) => this.handleErrorsOnRequest(errors)),
        map((response: any) => this.getBaseProjection(response))
      );
  }

  /**
   * Returns an observable built on a PUT request
   *
   * @param httpRequest
   */
  public put(httpRequest: HttpRequestInterface): Observable<any> {
    const options = this.getBaseOptions(httpRequest);
    const observable = this.areMocksEnabled || httpRequest.isForcedMock ?
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
      .pipe(
        retryWhen((errors: any) => this.handleErrorsOnRequest(errors)),
        map((response: any) => this.getBaseProjection(response))
      );
  }

  /**
   * Returns an observable built on a PATCH request
   *
   * @param httpRequest
   */
  public patch(httpRequest: HttpRequestInterface): Observable<any> {
    const options = this.getBaseOptions(httpRequest);
    const observable = this.areMocksEnabled || httpRequest.isForcedMock ?
      this.http.get(
        this.mockBaseUrl + httpRequest.mockUrl,
        options
      ) :
      this.http.patch(
        this.apiBaseUrl + httpRequest.apiUrl,
        httpRequest.body,
        options
      );
    return observable
      .pipe(
        retryWhen((errors: any) => this.handleErrorsOnRequest(errors)),
        map((response: any) => this.getBaseProjection(response))
      );
  }

  /**
   * Returns an observable built on a DELETE request
   *
   * @param httpRequest
   */
  public delete(httpRequest: HttpRequestInterface): Observable<any> {
    const options = this.getBaseOptions(httpRequest);
    const observable = this.areMocksEnabled || httpRequest.isForcedMock ?
      this.http.get(
        this.mockBaseUrl + httpRequest.mockUrl,
        options
      ) :
      this.http.delete(
        this.apiBaseUrl + httpRequest.apiUrl,
        options
      );
    return observable
      .pipe(
        retryWhen((errors: any) => this.handleErrorsOnRequest(errors)),
        map((response: any) => this.getBaseProjection(response))
      );
  }

}
