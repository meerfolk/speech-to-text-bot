import path from 'path';

import { IConfigurationService } from '../../domain/interfaces';

export class ConfigurationService implements IConfigurationService {
    private configuration: Record<string, unknown> = {};

    constructor(private readonly environment: string | undefined, private readonly fileDir: string) {
        this.init();
    }

    private readConfiguration(filePath: string): Record<string, unknown> | null {
        try {
            if (require.main === undefined) {
                return null;
            }

            return require(path.join(path.dirname(require.main.filename), filePath));
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    private init(): void {
        /* eslint-disable @typescript-eslint/no-var-requires */
        const defaultConfiguration = this.readConfiguration(`${this.fileDir}/default.js`);
        const environmentConfiguration = this.environment
            ? this.readConfiguration(`${this.fileDir}/${this.environment}.js`)
            : {};
        /* eslint-enable @typescript-eslint/no-var-requires */

        this.configuration = {
            ...(defaultConfiguration || {}),
            ...(environmentConfiguration || {}),
        };
    }

    public get<T>(path: string): T {
        const result = path.split('.')
            .reduce<Record<string, unknown>>((config, path) => {
                const partialContfig = config[path];

                return partialContfig as Record<string, unknown>;
            }, this.configuration);

        return result as T;
    }
}
