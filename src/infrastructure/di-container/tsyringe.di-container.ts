import { DependencyContainer, container as tsyringeContainer } from 'tsyringe';

import { IConfigurationService } from '../../domain/interfaces';
import { IBotService } from '../../domain/interfaces/bot-service.interface';
import { ConfigurationService } from '../configuration/configuration.service';

import { TelegramBotService } from '../telegram/telegram-bot.service';

import { IDIContainer } from './di-container.interface';

export class TsyringeDIContainer implements IDIContainer {
    private readonly container: DependencyContainer;

    constructor() {
        this.container = tsyringeContainer;
        this.init();
    }

    private configurationServiceFactory(): IConfigurationService {
        const environment = process.env.NODE_ENV;

        return new ConfigurationService(environment, './configuration');
    }

    private botServiceFactory(): IBotService {
        const configurationService = this.container.resolve<IConfigurationService>('ConfigurationService');
        const telegramToken = configurationService.get<string>('telegram.token');

        return new TelegramBotService(telegramToken);
    }

    private init(): void {
        this.container.register<IConfigurationService>('ConfigurationService', {
            useValue: this.configurationServiceFactory(),
        });
        this.container.register<IBotService>('BotService', {
            useValue: this.botServiceFactory(),
        });
    }

    public get<T>(token: string): T {
        return this.container.resolve<T>(token); 
    }
}
