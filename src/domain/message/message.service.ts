import { ILoggerService } from '../interfaces';
import { IBotService, SendMessageModel } from '../bot';

export class MessageService {
    private readonly messageIdsSet = new Set();

    constructor(
        private readonly botService: IBotService,
        private readonly availableChatIds: Array<number>,
        private readonly logger: ILoggerService,
    ) {}

    public async handleAudioMessages(): Promise<void> {
        const audioMessages = await this.botService.getAudioMessages();

        const filteredAudioMessages = audioMessages.filter((message) => {
            return !this.messageIdsSet.has(message.messageId)
                && this.availableChatIds.includes(message.chatId);
        });

        await Promise.all(filteredAudioMessages.map(async (message) => {
            const sendMessage = new SendMessageModel('Message handled', message.chatId, message.messageId);

            try {
                await this.botService.sendMessage(sendMessage);
                this.messageIdsSet.add(message.messageId);

                this.logger.info(`${message.messageId} handled`);
            } catch (err) {
                this.logger.error(err as Error);
            }
        }));
    }
}
