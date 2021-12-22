import { UploadFileModel } from '../upload';

export interface ISpeechService {
    toText: (model: UploadFileModel) => Promise<void>;
}
