import pino from 'pino';

import { ILoggerService } from '../../domain/interfaces';

export class PinoLoggerService implements ILoggerService {
    private readonly logger: pino.Logger; 

    constructor() {
        this.logger = pino();
    }

    public info(message: unknown, msg?: string): void {
        this.logger.info(message, msg);
    }

    public error(error: Error): void {
        this.logger.error(error);
    }
}
