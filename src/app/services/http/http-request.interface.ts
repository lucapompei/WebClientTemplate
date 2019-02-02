import { HttpHeaders } from '@angular/common/http';

/**
 * The http request interface
 */
export interface HttpRequestInterface {

    mockUrl: string;
    apiUrl: string;
    body?: any;
    observingResponse?: boolean;
    responseType?: string;
    isForcedMock?: boolean;
    customHeaders?: HttpHeaders;

}
