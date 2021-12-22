import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

import { ILoggerService } from '../../domain/interfaces';
import { IUploadService } from '../../domain/upload';

export interface IAzureOptions {
    sas: string;
    account: string;
    container: string;
}

export class AzureUploadService implements IUploadService {
    private static BLOB_STORAGE_TEMPLATE = 'https://{account}.blob.core.windows.net{sas}';

    constructor(
        private readonly logger: ILoggerService,
        private readonly options: IAzureOptions,
    ) {}

    private getBlobStorageUrl(): string {
        return AzureUploadService.BLOB_STORAGE_TEMPLATE
            .replace('{account}', this.options.account)
            .replace('{sas}', this.options.sas);
    }

    private getContainerClient(): ContainerClient {
        const serviceClient = new BlobServiceClient(this.getBlobStorageUrl());
        return serviceClient.getContainerClient(this.options.container);
    }

    public async upload(name: string, file: Buffer): Promise<void> {
        const container = this.getContainerClient();
        try {
            await container.uploadBlockBlob(name, file, file.length);
        } catch (err) {
            this.logger.error(err as Error);
            throw new Error('Upload file to blob storage failed');
        }
    }
}
