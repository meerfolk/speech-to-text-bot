export class SendMessageModel {
    constructor(
        public readonly message: string,
        public readonly chatId: number,
        public readonly replyToMessageId?: number,
    ) {}
}
