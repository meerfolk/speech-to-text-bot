import { DependencyContainer, container as tsyringeContainer } from 'tsyringe';

import { IConfigurationService, IHttpRequestService, ILoggerService } from '../../domain/interfaces';
import { IBotService } from '../../domain/bot';
import { MessageService } from '../../domain/message';

import { ConfigurationService } from '../configuration/configuration.service';
import { HttpRequestService } from '../http/http-request.service';
import { TelegramBotService } from '../telegram/telegram-bot.service';
import { PinoLoggerService } from '../logger/pino-logger.service';

import { IDIContainer } from './di-container.interface';

export class TsyringeDIContainer implements IDIContainer {
    private readonly container: DependencyContainer;

    constructor() {
        this.container = tsyringeContainer;
        this.init();
    }

    private configurationServiceFactory(): IConfigurationService {
        const useLocalConfiguration = process.env.USE_LOCAL_CONFIGURATION === 'true';

        return new ConfigurationService('configuration', useLocalConfiguration);
    }

    private botServiceFactory(): IBotService {
        const configurationService = this.container.resolve<IConfigurationService>('ConfigurationService');
        const httpRequestService = this.container.resolve<IHttpRequestService>('HttpRequestService');
        const telegramToken = configurationService.get<string>('telegram.token');

        return new TelegramBotService(telegramToken, httpRequestService);
    }

    private httpRequestServiceFactory(): IHttpRequestService {
        return new HttpRequestService();
    }

    private messageServiceFactory(): MessageService {
        const botService = this.container.resolve<IBotService>('BotService');
        const configurationService = this.container.resolve<IConfigurationService>('ConfigurationService');

    private loggerServiceFactory(): ILoggerService {
        return new PinoLoggerService();
    }

    private init(): void {
        this.container.register<IConfigurationService>('ConfigurationService', {
            useValue: this.configurationServiceFactory(),
        });
        this.container.register<ILoggerService>('LoggerService', {
            useValue: this.loggerServiceFactory(),
        });
        this.container.register('HttpRequestService', {
            useValue: this.httpRequestServiceFactory(),
        });
        this.container.register<IBotService>('BotService', {
            useValue: this.botServiceFactory(),
        });
        this.container.register<MessageService>('MessageService', {
            useValue: this.messageServiceFactory(),
        });
    }

    public get<T>(token: string): T {
        return this.container.resolve<T>(token); 
    }
}
