import { request } from 'https';

import { IHttpRequestService, IPostOptions } from '../../domain/interfaces';

export class HttpRequestService implements IHttpRequestService {
    public async get(url: string): Promise<unknown> {
        const buffer = await this.getBuffer(url);

        const result = buffer.toString('utf8');

        return JSON.parse(result);
    }

    private generatePostHeaders(headers?: Record<string, string>): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            ...(headers ?? {}),
        };
    }

    public async getBuffer(url: string): Promise<Buffer> {
        const chunks: Array<Buffer> = [];

        return new Promise((resolve, reject) => {
            const req = request(url, (res) => {
                res
                    .on('data', (data: Buffer) => {
                        chunks.push(data);
                    })
                    .on('end', () => {
                        resolve(Buffer.concat(chunks));
                    });
            });

            req.on('error', reject);
            req.end();
        });
    }

    public async post(url: string, body?: object, options?: IPostOptions): Promise<unknown> {
        const result: string = await new Promise<string>((resolve, reject) => {
            const req = request(
                url,
                {
                    method: 'POST',
                    headers: this.generatePostHeaders(options?.headers),
                },
                (res) => {
                    res.on('data', (data: Buffer) => {
                        resolve(data.toString('utf8'));
                    });
                },
            );

            req.on('error', reject);

            if (body) {
                req.write(JSON.stringify(body));
            }

            req.end();
        });


        return JSON.parse(result);

    }
}
