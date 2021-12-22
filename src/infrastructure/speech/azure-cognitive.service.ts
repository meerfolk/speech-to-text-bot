import { ISpeechService } from '../../domain/speech';
import { UploadFileModel } from '../../domain/upload';
import { IHttpRequestService } from '../../domain/interfaces';

type CognitiveServiceBoydType = {
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

interface IOptions {
    region: string;
    subscriptionKey: string;
    locale: string;
    storage: {
        container: string;
        sas: string;
        account: string;
    };
}

export class AzureCognitiveService implements ISpeechService {
    private static COGNITIVE_SERVICE_TEMPLATE = 'https://{region}.cris.ai/api/speechtotext/v2.0/Transcriptions';
    private static BLOB_STORAGE_TEMPLATE = 'https://{account}.blob.core.windows.net{sas}';
    private static BLOB_STORAGE_FILE_TEMPLATE = 'https://{account}.blob.core.windows.net/{container}/{file}{sas}';

    constructor(private readonly httpRequestService: IHttpRequestService, private readonly options: IOptions) {}

    private getCognitiveServiceUrl(): string {
        return AzureCognitiveService.COGNITIVE_SERVICE_TEMPLATE
            .replace('{region}', this.options.region);
    }

    private getBlobStorageUrl(): string {
        return AzureCognitiveService.BLOB_STORAGE_TEMPLATE
            .replace('{account}', this.options.storage.account)
            .replace('{sas}', this.options.storage.sas);
    }

    private getFileUrl(fileName: string): string {
        return AzureCognitiveService.BLOB_STORAGE_FILE_TEMPLATE
            .replace('{account}', this.options.storage.account)
            .replace('{container}', this.options.storage.container)
            .replace('{file}', fileName)
            .replace('{sas}', this.options.storage.sas);
    }

    private generateBody(fileName: string): CognitiveServiceBoydType {
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

    public async toText(model: UploadFileModel): Promise<void> {
        const url = this.getCognitiveServiceUrl();
        const body = this.generateBody(model.name);

        const location = await this.httpRequestService.post(url, body, {
            headers: {
                'Ocp-Apim-Subscription-Key': this.options.subscriptionKey,
            }
        });
        console.log(location);
    }
}
