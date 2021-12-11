import { IBotService, SendMessageModel } from '../bot';

export class MessageService {
    private readonly messageIdsSet = new Set();

    constructor(private readonly botService: IBotService, private readonly availableChatIds: Array<number>) {}

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
            } catch (err) {
                console.error(err);
            }

            this.messageIdsSet.add(message.messageId);
        }));
    }
}
