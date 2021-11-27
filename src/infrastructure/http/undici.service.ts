import { fetch } from 'undici';

import { IHttpRequestService } from '../../domain/interfaces';

export class UndiciService implements IHttpRequestService {
  async get(url: string): Promise<unknown> {
    const response = await fetch(url);

    return response.json();
  }
}
