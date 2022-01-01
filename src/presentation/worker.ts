import 'reflect-metadata';

import { MessageService } from '../domain/message';
import { ILoggerService } from '../domain/interfaces';
import { ConfigurationService } from '../infrastructure/configuration/configuration.service';
import { diContainer } from '../infrastructure/di-container';

let interval: NodeJS.Timer | null = null;

const messageService = diContainer.get<MessageService>('MessageService');
const configurationService = diContainer.get<ConfigurationService>('ConfigurationService');
const loggerService = diContainer.get<ILoggerService>('LoggerService');

(async function() {
    const intervalTime = configurationService.get<number>('workerInterval');

    interval = setInterval(() => {
        messageService.handleAudioMessages()
            .catch((error) => {
                loggerService.error(error);
            });
    }, intervalTime);
})();

const shutdown = () => {
    if (interval) {
        clearInterval(interval);
    }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
