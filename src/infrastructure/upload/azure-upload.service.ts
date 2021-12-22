import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

import { ILoggerService } from '../../domain/interfaces';
import { IUploadService, UploadFileModel } from '../../domain/upload';

export interface IAzureStorageOptions {
    sas: string;
    account: string;
    container: string;
    container_sas: string;
}

export class AzureUploadService implements IUploadService {
    private static BLOB_STORAGE_TEMPLATE = 'https://{account}.blob.core.windows.net{sas}';
    private static BLOB_STORAGE_FILE_TEMPLATE = 'https://{account}.blob.core.windows.net/{container}/{file}{sas}';

    constructor(
        private readonly logger: ILoggerService,
        private readonly options: IAzureStorageOptions,
    ) {}

    private getBlobStorageUrl(): string {
        return AzureUploadService.BLOB_STORAGE_TEMPLATE
            .replace('{account}', this.options.account)
            .replace('{sas}', this.options.sas);
    }

    private getFileUrl(fileName: string): string {
        return AzureUploadService.BLOB_STORAGE_FILE_TEMPLATE
            .replace('{account}', this.options.account)
            .replace('{container}', this.options.container)
            .replace('{file}', fileName)
            .replace('{sas}', this.options.sas);
    }

    private getContainerClient(): ContainerClient {
        const serviceClient = new BlobServiceClient(this.getBlobStorageUrl());
        return serviceClient.getContainerClient(this.options.container);
    }

    public async upload(name: string, file: Buffer): Promise<UploadFileModel> {
        const container = this.getContainerClient();
        try {
            await container.uploadBlockBlob(name, file, file.length);

            return new UploadFileModel(name, this.getFileUrl(name), file);
        } catch (err) {
            this.logger.error(err as Error);
            throw new Error('Upload file to blob storage failed');
        }
    }
}
