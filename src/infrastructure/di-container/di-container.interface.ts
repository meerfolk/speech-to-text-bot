export interface IDIContainer {
    get: <T>(token: string) => T;
}
