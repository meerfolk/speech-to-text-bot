import { request } from 'https';

import { IHttpRequestService } from '../../domain/interfaces';

export class HttpRequestService implements IHttpRequestService {
    public async get(path: string): Promise<unknown> {
        const result: string = await new Promise<string>((resolve, reject) => {
            const req = request(path, (res) => {
                res.on('data', (data: Buffer) => {
                    resolve(data.toString('utf8'));
                });
            });

            req.on('error', reject);
            req.end();
        });


        return JSON.parse(result);
    }
}
