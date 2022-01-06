import { ISpeechService, SpeechRecognitionModel } from '../../domain/speech';
import { IHttpRequestService } from '../../domain/interfaces';
import { UploadFileModel } from '../../domain/upload';

import { IYandexStorageOptions } from '../upload';

import { BaseSpeechService } from './base-speech.service';

export interface IYandexSpeechKitOptions {
    sotrage: IYandexStorageOptions;
    apiKey: string;
}

type YandexSpeechkitBodyType = {
    config: {
        specification: {
            languageCode: string;
        };
    };
    audio: {
        uri: string;
    };
};

export class YandexSpeechkitService extends BaseSpeechService<YandexSpeechkitBodyType>
    implements ISpeechService {
    private static SPEECHKIT_ENDPOINT = 'https://transcribe.api.cloud.yandex.net/speech/stt/v2/longRunningRecognize';
    private static STORAGE_ENPOINT_TEMPLATE = 'https://storage.yandexcloud.net/<bucket>/<key>';

    constructor(httpRequestService: IHttpRequestService, private readonly options: IYandexSpeechKitOptions) {
        super(httpRequestService);
    }

    private getFileUrl(fileName: string): string {
        return YandexSpeechkitService.STORAGE_ENPOINT_TEMPLATE
            .replace('<bucket>', this.options.sotrage.bucket)
            .replace('<key>', fileName);
    }

    protected getServiceUrl(): string {
        return YandexSpeechkitService.SPEECHKIT_ENDPOINT;
    }

    protected generateBody(fileName: string): YandexSpeechkitBodyType {
        return {
            config: {
                specification: {
                    languageCode: 'ru-RU',
                },
            },
            audio: {
                uri: this.getFileUrl(fileName),
            },
        };
    }

    protected generateHeaders(): Record<string, string> {
        return {
            'Authorization': `Api-Key ${this.options.apiKey}`,
        };
    }

    public async toText(model: UploadFileModel): Promise<SpeechRecognitionModel | null> {
        const [_res, body] = await this.sendRequest(model);

        const { id } = body as { id: string };

        return new SpeechRecognitionModel(id);
    }
}
