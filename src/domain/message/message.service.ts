import { IBotService, SendMessageModel } from '../bot';

export class MessageService {
    constructor(private readonly botService: IBotService, private readonly availableChatIds: Array<number>) {}

    public async handleAudioMessages(): Promise<void> {
        const audioMessages = await this.botService.getAudioMessages();

        const filteredAudioMessages = audioMessages.filter((message) => {
            return this.availableChatIds.includes(message.chatId);
        });

        await Promise.all(filteredAudioMessages.map((message) => {
            const sendMessage = new SendMessageModel('Message handled', message.chatId, message.messageId);

            return this.botService.sendMessage(sendMessage);
        }));
    }
}
