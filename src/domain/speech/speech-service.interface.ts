import { UploadFileModel } from '../upload';

import { SpeechRecognitionModel } from './models';

export interface ISpeechService {
    toText: (model: UploadFileModel) => Promise<SpeechRecognitionModel | null>;
}
