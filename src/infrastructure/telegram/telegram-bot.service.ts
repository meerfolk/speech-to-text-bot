import { IBotService , IHttpRequestService } from '../../domain/interfaces';

export class TelegramBotService implements IBotService {
    private static TELEGRAM_BOT_URL = 'https://api.telegram.org/bot<token>';

    private readonly telegramBaseUrl: string;

    constructor(token: string, private readonly httpRequestService: IHttpRequestService) {
        this.telegramBaseUrl = TelegramBotService.TELEGRAM_BOT_URL.replace('<token>', token);
    }

    public async getUpdates(): Promise<void> {
        const url = `${this.telegramBaseUrl}/getUpdates`;

        const response = await this.httpRequestService.get(url);

        console.log(JSON.stringify(response, null, 2));
    }
}
