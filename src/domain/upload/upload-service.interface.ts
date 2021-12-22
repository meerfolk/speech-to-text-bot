import { UploadFileModel } from './models/upload-file.model';

export interface IUploadService {
    upload: (name: string, file: Buffer) => Promise<UploadFileModel>;
}
