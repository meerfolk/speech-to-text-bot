export interface IHttpRequestService {
    get: (url: string) => Promise<unknown>;
    post: (url: string, body?: object) => Promise<unknown>;
}
