import { IncomingMessage } from 'http';
import { request } from 'https';

import { IHttpRequestService, IPostOptions } from '../../domain/interfaces';

type Methods = 'GET' | 'POST';

interface IRequestOptions {
    method: Methods;
    url: string;
    headers?: Record<string, string>;
    body?: object;
}

export class HttpRequestService implements IHttpRequestService {
    private generatePostHeaders(headers?: Record<string, string>): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            ...(headers ?? {}),
        };
    }

    private requestRaw(options: IRequestOptions): Promise<[IncomingMessage, Buffer]> {
        const chunks: Array<Buffer> = []; 
        const { method, url, body, headers } = options;

        return new Promise((resolve, reject) => {
            const req = request(
                url,
                {
                    method,
                    headers: headers ?? {},
                },
                (res) => {
                    res.on('data', (chunk: Buffer) => {
                        chunks.push(chunk);
                    });

                    res.on('end', () => {
                        const buffer = Buffer.concat(chunks);

                        if ((res.statusCode ?? 500) > 400) {
                            reject(new Error(`${method} ${url} request was failed`));
                            return;
                        }

                        resolve([res, buffer]);
                    });
                }
            );

            if (body !== undefined) {
                req.write(JSON.stringify(body));
            }

            req.on('error', reject);
            req.end();
        });
    }

    public async get(url: string): Promise<unknown> {
        const [_response, buffer] = await this.requestRaw({
            url,
            method: 'GET',
        });

        const result = buffer.toString('utf8');

        return JSON.parse(result);
    }

    public async getBuffer(url: string): Promise<Buffer> {
        const [_, buffer] = await this.requestRaw({
            url,
            method: 'GET',
        });

        return buffer;
    }

    public async post(url: string, body?: object, options?: IPostOptions): Promise<unknown> {
        const [_response, data] = await this.postRaw(url, body, options);

        return data;
    }

    public async postRaw(url: string, body?: object, options?: IPostOptions): Promise<[IncomingMessage, unknown]> {
        const [response, buffer] = await this.requestRaw({
            url,
            method: 'POST',
            body,
            headers: this.generatePostHeaders(options?.headers),
        });

        const data = buffer.toString('utf8');

        return [response, JSON.parse(data)];
    }
}
