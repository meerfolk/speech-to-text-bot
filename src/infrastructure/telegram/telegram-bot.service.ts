import { IHttpRequestService } from '../../domain/interfaces';
import { IBotService } from '../../domain/bot';
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
}
