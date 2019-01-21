import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { NetworkService } from '../network/network.service';

/**
 * The http interceptor used to automatically manage the http requests
 */
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

    constructor(private networkService: NetworkService) { }

    /**
     * Intercepts the request adding the authentication token if it is present
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.networkService.getAuthenticationToken()
            .pipe(
                flatMap((response: any) => {
                    if (response == null) {
                        return next.handle(request);
                    } else {
                        request = request.clone({
                            setHeaders: {
                                Authorization: `${response}`
                            }
                        });
                        return next.handle(request);
                    }
                })
            );
    }
}
