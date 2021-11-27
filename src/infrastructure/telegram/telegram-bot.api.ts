import { IHttpRequestService } from '../../domain/interfaces/http-request.service.interface';
import { UndiciService } from '../http/undici.service';

export class TelegramBotService {
    private static TELEGRAM_BOT_URL = 'https://api.telegram.org/bot<token>';

    private readonly telegramBaseUrl: string;
    private readonly httpRequestService: IHttpRequestService;

    constructor(token: string) {
        this.httpRequestService = new UndiciService();
        this.telegramBaseUrl = TelegramBotService.TELEGRAM_BOT_URL.replace(
            '<token>',
            token,
        );
    }

    public async getUpdates(): Promise<void> {
        const url = `${this.telegramBaseUrl}/getUpdates`;

        const response = await this.httpRequestService.get(url);

        console.log(JSON.stringify(response, null, 2));
    }
}
