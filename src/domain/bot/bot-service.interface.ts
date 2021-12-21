import { AudioMessageModel, SendMessageModel } from './models';

export interface IBotService {
    logUpdates: () => Promise<void>;
    getAudioMessages: () => Promise<Array<AudioMessageModel>>;
    sendMessage: (message: SendMessageModel) => Promise<void>;
    downloadAudioFile: (model: AudioMessageModel) => Promise<Buffer>;
}
