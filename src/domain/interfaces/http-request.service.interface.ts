export interface IPostOptions {
    headers?: Record<string, string>;
}

export interface IHttpRequestService {
    get: (url: string) => Promise<unknown>;
    getBuffer: (url: string) => Promise<Buffer>;
    post: (url: string, body?: object, options?: IPostOptions) => Promise<unknown>;
}
