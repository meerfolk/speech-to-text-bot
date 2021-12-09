import { IHttpRequestService } from '../../domain/interfaces/http-request.service.interface';

import { Update, UpdateResponseSchema } from './schemas/update.schema';

interface ISendMessageOptions {
    replyToMessageId?: number;
}

export class TelegramBotApi {
    private static TELEGRAM_BOT_URL = 'https://api.telegram.org/bot<token>';

    private readonly telegramBaseUrl: string;

    constructor(private readonly httpRequestService: IHttpRequestService, token: string) {
        this.telegramBaseUrl = TelegramBotApi.TELEGRAM_BOT_URL.replace(
            '<token>',
            token,
        );
    }

    private getUrl(method: string): string {
        return `${this.telegramBaseUrl}/${method}`;
    }

    public async getUpdates(): Promise<Array<Update>> {
        const url = this.getUrl('getUpdates');

        const response = await this.httpRequestService.get(url);

        const validation = UpdateResponseSchema.safeParse(response);

        if (validation.success === false) {
            throw validation.error;
        }

        return validation.data.result; 
    }

    public async sendMessage(message: string, chatId: number, options: ISendMessageOptions): Promise<void> {
        const url = this.getUrl('sendMessage');

        await this.httpRequestService.post(url, {
            text: message,
            chat_id: chatId,
            reply_to_message_id: options?.replyToMessageId,
        });
    }
}
