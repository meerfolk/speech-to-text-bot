import { MessageModel } from './message.model';

export class AudioMessageModel extends MessageModel {
    constructor(
        messageId: number,
        chatId: number,
        public readonly fileId: string,
    ) {
        super(messageId, chatId);
    }
}
