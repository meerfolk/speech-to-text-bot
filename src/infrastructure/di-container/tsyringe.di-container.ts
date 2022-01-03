import { DependencyContainer, container as tsyringeContainer } from 'tsyringe';

import {
    IConfigurationService,
    IHttpRequestService,
    ILoggerService,
    INameGeneratorService,
} from '../../domain/interfaces';
import { IBotService } from '../../domain/bot';
import { IUploadService } from '../../domain/upload';
import { MessageService } from '../../domain/message';
import { ISpeechService } from '../../domain/speech';

import { ConfigurationService } from '../configuration/configuration.service';
import { HttpRequestService } from '../http/http-request.service';
import { TelegramBotService } from '../telegram/telegram-bot.service';
import { PinoLoggerService } from '../logger/pino-logger.service';
import { AzureUploadService, IAzureStorageOptions } from '../upload';
import { UUIDNameGeneratorService } from '../name-generator';

import { IDIContainer } from './di-container.interface';
import { AzureCognitiveService, IAzureCognitiveOptions } from '../speech';

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
        const loggerService = this.container.resolve<ILoggerService>('LoggerService');

        return new HttpRequestService(loggerService);
    }

    private messageServiceFactory(): MessageService {
        const botService = this.container.resolve<IBotService>('BotService');
        const configurationService = this.container.resolve<IConfigurationService>('ConfigurationService');
        const loggerService = this.container.resolve<ILoggerService>('LoggerService');
        const uploadService = this.container.resolve<IUploadService>('UploadService');
        const namgeGeneratorService = this.container.resolve<INameGeneratorService>('NameGeneratorService');
        const speechService = this.container.resolve<ISpeechService>('SpeechService');

        return new MessageService(
            botService,
            configurationService.get('availableChatIds'),
            loggerService,
            uploadService,
            namgeGeneratorService,
            speechService,
        );
    }

    private loggerServiceFactory(): ILoggerService {
        return new PinoLoggerService();
    }

    private uploadServiceFactory(): IUploadService {
        const loggerService = this.container.resolve<ILoggerService>('LoggerService');
        const configurationService = this.container.resolve<IConfigurationService>('ConfigurationService');

        return new AzureUploadService(loggerService, configurationService.get('cloud.azure.storage'));
    }

    private nameGeneratorServiceFactory(): INameGeneratorService {
        return new UUIDNameGeneratorService();
    }

    private speechServiceFactory(): ISpeechService {
        const httpRequestService = this.container.resolve<IHttpRequestService>('HttpRequestService');
        const configurationService = this.container.resolve<IConfigurationService>('ConfigurationService');
        const azureStorageOptions = configurationService.get<IAzureStorageOptions>('cloud.azure.storage');
        const azureCognitiveServiceOptions = configurationService.get<IAzureCognitiveOptions>('cloud.azure.cognitive');

        return new AzureCognitiveService(httpRequestService, {
            ...azureCognitiveServiceOptions,
            storage: {
                ...azureStorageOptions,
            },
        });
    }

    private init(): void {
        this.container.register<IConfigurationService>('ConfigurationService', {
            useValue: this.configurationServiceFactory(),
        });
        this.container.register<ILoggerService>('LoggerService', {
            useValue: this.loggerServiceFactory(),
        });
        this.container.register<INameGeneratorService>('NameGeneratorService', {
            useValue: this.nameGeneratorServiceFactory(),
        });
        this.container.register<IHttpRequestService>('HttpRequestService', {
            useValue: this.httpRequestServiceFactory(),
        });
        this.container.register<IBotService>('BotService', {
            useValue: this.botServiceFactory(),
        });
        this.container.register<IUploadService>('UploadService', {
            useValue: this.uploadServiceFactory(),
        });
        this.container.register<ISpeechService>('SpeechService', {
            useValue: this.speechServiceFactory(),
        });
        this.container.register<MessageService>('MessageService', {
            useValue: this.messageServiceFactory(),
        });
    }

    public get<T>(token: string): T {
        return this.container.resolve<T>(token); 
    }
}
