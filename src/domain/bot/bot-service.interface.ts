import { AudioMessageModel } from './models';

export interface IBotService {
    logUpdates: () => Promise<void>;
    getAudioMessages: () => Promise<Array<AudioMessageModel>>;
}
