import { IHttpRequestService, RawResponse } from '../../domain/interfaces';
import { UploadFileModel } from '../../domain/upload';

export abstract class BaseSpeechService<T extends object> {
    constructor(private readonly httpRequestService: IHttpRequestService) {}

    protected abstract getServiceUrl(): string;

    protected abstract generateBody(name: string): T;

    protected abstract generateHeaders(): Record<string, string>;

    protected async sendRequest(model: UploadFileModel): Promise<[RawResponse, unknown]> {
        const url = this.getServiceUrl();
        const body = this.generateBody(model.name);
        const headers = this.generateHeaders();

        const response = await this.httpRequestService.postRaw(url, body, {
            headers,
        });

        return response;
    }
}
