import { request } from 'https';

import { IHttpRequestService } from '../../domain/interfaces';

export class HttpRequestService implements IHttpRequestService {
    public async get(url: string): Promise<unknown> {
        const result: string = await new Promise<string>((resolve, reject) => {
            const req = request(url, (res) => {
                res.on('data', (data: Buffer) => {
                    resolve(data.toString('utf8'));
                });
            });

            req.on('error', reject);
            req.end();
        });


        return JSON.parse(result);
    }

    public async post(url: string, body?: object): Promise<unknown> {
        const result: string = await new Promise<string>((resolve, reject) => {
            const req = request(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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
