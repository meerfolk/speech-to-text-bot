export interface IHttpRequestService {
    get: (url: string) => Promise<unknown>;
    getBuffer: (url: string) => Promise<Buffer>;
    post: (url: string, body?: object) => Promise<unknown>;
}
