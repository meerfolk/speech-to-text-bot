import { UploadFileModel } from './models/upload-file.model';

export interface IUploadService {
    upload: (model: UploadFileModel) => Promise<void>;
}
