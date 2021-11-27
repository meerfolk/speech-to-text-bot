export interface IHttpRequestService {
    get: (url: string) => Promise<unknown>;
}
