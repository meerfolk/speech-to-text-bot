import { DependencyContainer, container as tsyringeContainer } from 'tsyringe';

import { IConfigurationService, IHttpRequestService } from '../../domain/interfaces';
import { IBotService } from '../../domain/interfaces/bot-service.interface';
import { ConfigurationService } from '../configuration/configuration.service';
import { HttpRequestService } from '../http/http-request.service';

import { TelegramBotService } from '../telegram/telegram-bot.service';

import { IDIContainer } from './di-container.interface';

export class TsyringeDIContainer implements IDIContainer {
    private readonly container: DependencyContainer;

    constructor() {
        this.container = tsyringeContainer;
        this.init();
    }

    private configurationServiceFactory(): IConfigurationService {
        const useLocalConfiguration = process.env.USE_LOCAL_CONFIGURATION === 'true';

        return new ConfigurationService('./configuration', useLocalConfiguration);
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

    private init(): void {
        this.container.register<IConfigurationService>('ConfigurationService', {
            useValue: this.configurationServiceFactory(),
        });
        this.container.register('HttpRequestService', {
            useValue: this.httpRequestServiceFactory(),
        });
        this.container.register<IBotService>('BotService', {
            useValue: this.botServiceFactory(),
        });
    }

    public get<T>(token: string): T {
        return this.container.resolve<T>(token); 
    }
}
