import { IHttpRequestService } from '../../domain/interfaces/http-request.service.interface';

import { Update, UpdateResponseSchema, FileResponseSchema } from './schemas';

interface ISendMessageOptions {
    replyToMessageId?: number;
}

export class TelegramBotApi {
    private static TELEGRAM_BOT_URL = 'https://api.telegram.org/bot<token>';
    private static TELEGRAM_FILE_URL =  'https://api.telegram.org/file/bot<token>';

    private readonly telegramBotBaseUrl: string;
    private readonly telegramFileBaseUrl: string;

    constructor(private readonly httpRequestService: IHttpRequestService, token: string) {
        this.telegramBotBaseUrl = TelegramBotApi.TELEGRAM_BOT_URL.replace(
            '<token>',
            token,
        );
        this.telegramFileBaseUrl = TelegramBotApi.TELEGRAM_FILE_URL.replace(
            '<token>',
            token,
        );
    }

    private getUrl(method: string): string {
        return `${this.telegramBotBaseUrl}/${method}`;
    }

    private async getFileBuffer(filePath: string): Promise<Buffer> {
        const url = `${this.telegramFileBaseUrl}/${filePath}`;

        return this.httpRequestService.getBuffer(url);
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

    public async getFile(fileId: string): Promise<Buffer> {
        const url = this.getUrl(`getFile?file_id=${fileId}`);

        const response = await this.httpRequestService.get(url);

        const validation = FileResponseSchema.safeParse(response);

        if (validation.success === false) {
            throw validation.error;
        }

        return this.getFileBuffer(validation.data.result.file_path);
    }

}
