import { Observable } from 'rxjs/Observable';

export interface HttpRequestInterface {

    mockUrl: string;
    apiUrl: string;
    body?: any;
    authenticationToken?: Observable<string>;
    observingResponse?: boolean;

}
