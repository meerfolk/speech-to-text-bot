import { IHttpRequestService } from '../../domain/interfaces';
import { IBotService, AudioMessageModel } from '../../domain/bot';

import { TelegramBotApi } from './telegram-bot.api';

export class TelegramBotService implements IBotService {
    private readonly api: TelegramBotApi;

    constructor(token: string, httpRequestService: IHttpRequestService) {
        this.api = new TelegramBotApi( httpRequestService, token);
    }

    public async logUpdates(): Promise<void> {
        const updates = await this.api.getUpdates();

        console.log(JSON.stringify(updates, null, 2));
    }

    public async getAudioMessages(): Promise<Array<AudioMessageModel>> {
        const updates = await this.api.getUpdates();

        return updates.reduce((models, update) => {
            if (update.message && update.message.audio) {
                models.push(new AudioMessageModel(
                    update.message.message_id,
                    update.message.chat.id,
                    update.message.audio.file_id,
                ));
            }

            return models;
        }, [] as Array<AudioMessageModel>);
    }
}
