import 'reflect-metadata';

import { IBotService } from './src/domain/bot';
import { diContainer } from './src/infrastructure/di-container';

const telegramBotService = diContainer.get<IBotService>('BotService');

(async function () {
    await telegramBotService.logUpdates();
})();

