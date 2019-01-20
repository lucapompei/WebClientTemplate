/**
 * The http request interface
 */
export interface HttpRequestInterface {

    mockUrl: string;
    apiUrl: string;
    body?: any;
    observingResponse?: boolean;
    responseType?: string;
    isPooling?: boolean;
    isForcedMock?: boolean;

}
