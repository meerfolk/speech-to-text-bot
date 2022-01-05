import { ISpeechService } from '../../domain/speech';
import { UploadFileModel } from '../../domain/upload';
import { IHttpRequestService } from '../../domain/interfaces';
import { SpeechRecognitionModel } from '../../domain/speech';
import { IAzureStorageOptions } from '../upload';

import { BaseSpeechService } from './base-speech.service';

type CognitiveServiceBodyType = {
    RecordingsUrl: string;
    Locale: string;
    Name: string;
    Description: string;
    Properties: {
        ProfanityFilterMode: 'None' | 'Removed' | 'Tags' | 'Masked';
        PunctuationMode: 'None' | 'Dictated' | 'Automatic' | 'DictatedAndAutomatic';
        AddSentiment: 'True' | 'False';
        AddDiarization: 'True' | 'False';
        TranscriptionResultsContainerUrl: string;
    };
};

export interface IAzureCognitiveOptions {
    region: string;
    subscriptionKey: string;
    locale: string;
    storage: IAzureStorageOptions;
}

export class AzureCognitiveService extends BaseSpeechService<CognitiveServiceBodyType>
    implements ISpeechService {
    private static COGNITIVE_SERVICE_TEMPLATE = 'https://{region}.cris.ai/api/speechtotext/v2.0/Transcriptions';
    private static BLOB_STORAGE_TEMPLATE = 'https://{account}.blob.core.windows.net{sas}';
    private static BLOB_STORAGE_FILE_TEMPLATE = 'https://{account}.blob.core.windows.net/{container}/{file}{sas}';

    constructor(httpRequestService: IHttpRequestService, private readonly options: IAzureCognitiveOptions) {
        super(httpRequestService);
    }

    private getBlobStorageUrl(): string {
        return AzureCognitiveService.BLOB_STORAGE_TEMPLATE
            .replace('{account}', this.options.storage.account)
            .replace('{sas}', this.options.storage.container_sas);
    }

    private getFileUrl(fileName: string): string {
        return AzureCognitiveService.BLOB_STORAGE_FILE_TEMPLATE
            .replace('{account}', this.options.storage.account)
            .replace('{container}', this.options.storage.container)
            .replace('{file}', fileName)
            .replace('{sas}', this.options.storage.sas);
    }

    protected getServiceUrl(): string {
        return AzureCognitiveService.COGNITIVE_SERVICE_TEMPLATE
            .replace('{region}', this.options.region);
    }

    protected generateBody(fileName: string): CognitiveServiceBodyType {
        return {
            RecordingsUrl: this.getFileUrl(fileName),
            Locale: this.options.locale,
            Name: fileName,
            Description: 'Recognized using meerfolk-speech-to-text bot',
            Properties: {
                TranscriptionResultsContainerUrl: this.getBlobStorageUrl(),
                ProfanityFilterMode: 'None',
                PunctuationMode: 'None',
                AddSentiment: 'False',
                AddDiarization: 'False',
            }
        };
    }

    protected generateHeaders(): Record<string, string> {
        return {
            'Ocp-Apim-Subscription-Key': this.options.subscriptionKey,
        };
    }

    public async toText(model: UploadFileModel): Promise<SpeechRecognitionModel | null> {
        const [response] = await this.sendRequest(model);

        const location = response.headers?.location;

        if (location) {
            const uid = location.split('/').splice(-1)[0];
            return new SpeechRecognitionModel(uid);
        }

        return null;
    }
}
