import { IHttpRequestService } from '../../domain/interfaces/http-request.service.interface';

import { Update, UpdateResponseSchema } from './schemas/update.schema';

export class TelegramBotApi {
    private static TELEGRAM_BOT_URL = 'https://api.telegram.org/bot<token>';

    private readonly telegramBaseUrl: string;

    constructor(private readonly httpRequestService: IHttpRequestService, token: string) {
        this.telegramBaseUrl = TelegramBotApi.TELEGRAM_BOT_URL.replace(
            '<token>',
            token,
        );
    }

    public async getUpdates(): Promise<Array<Update>> {
        const url = `${this.telegramBaseUrl}/getUpdates`;

        const response = await this.httpRequestService.get(url);

        const validation = UpdateResponseSchema.safeParse(response);

        if (validation.success === false) {
            throw validation.error;
        }

        return validation.data.result; 
    }
}
