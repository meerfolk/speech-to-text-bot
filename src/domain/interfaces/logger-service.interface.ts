export interface ILoggerService {
    info: (message: unknown, msg?: string) => void;
    error: (message: Error) => void;
}
