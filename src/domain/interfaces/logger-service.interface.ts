export interface ILoggerService {
    info: (message: string) => void;
    error: (message: Error) => void;
}
