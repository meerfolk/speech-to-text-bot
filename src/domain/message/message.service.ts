import { ILoggerService, INameGeneratorService } from '../interfaces';
import { IBotService, SendMessageModel } from '../bot';
import { IUploadService, UploadFileModel } from '../upload';
import { ISpeechService } from '../speech';

export class MessageService {
    private readonly messageIdsSet = new Set();

    constructor(
        private readonly botService: IBotService,
        private readonly availableChatIds: Array<number>,
        private readonly logger: ILoggerService,
        private readonly uploadService: IUploadService,
        private readonly namgeGeneratorService: INameGeneratorService,
        private readonly speechService: ISpeechService,
    ) {}

    public async handleAudioMessages(): Promise<void> {
        const audioMessages = await this.botService.getAudioMessages();

        const filteredAudioMessages = audioMessages.filter((message) => {
            return !this.messageIdsSet.has(message.messageId)
                && this.availableChatIds.includes(message.chatId);
        });

        await Promise.all(filteredAudioMessages.map(async (message) => {
            let text: null | string = null;
            try {
                this.logger.info(`Processing ${message.messageId}`);
                this.messageIdsSet.add(message.messageId);

                const file = await this.botService.downloadAudioFile(message);

                const fileName = this.namgeGeneratorService.generate();
                const uploadFileModel = new UploadFileModel(fileName, fileName, file);
                await this.uploadService.upload(uploadFileModel);

                const speechRecognitionModel = await this.speechService.toText(uploadFileModel);

                text = `File uploaded. Name: ${fileName}. Recognition ${speechRecognitionModel?.recognitionId || ''} started`;
            } catch (err) {
                this.logger.error(err as Error);
                this.messageIdsSet.delete(message.messageId);

                text = 'Failed to handle message';
            }

            const sendMessage = new SendMessageModel(text, message.chatId, message.messageId);
            await this.botService.sendMessage(sendMessage);
        }));
    }
}
