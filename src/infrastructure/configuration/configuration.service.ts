import path from 'path';

import { IConfigurationService } from '../../domain/interfaces';

export class ConfigurationService implements IConfigurationService {
    private configuration: Record<string, unknown> = {};

    constructor(private readonly fileDir: string, private readonly useLocalConfiguration: boolean = false) {
        this.init();
    }

    private readConfiguration(filePath: string): Record<string, unknown> | null {
        try {
            if (require.main === undefined) {
                return null;
            }

            return require(path.join(process.cwd(), filePath));
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    private init(): void {
        /* eslint-disable @typescript-eslint/no-var-requires */
        const defaultConfiguration = this.readConfiguration(`${this.fileDir}/default.js`);
        const localConfiguration = this.useLocalConfiguration
            ? this.readConfiguration(`${this.fileDir}/local.js`)
            : null;
        /* eslint-enable @typescript-eslint/no-var-requires */

        if (defaultConfiguration === null && localConfiguration === null) {
            throw new Error('No configuration found');
        }

        this.configuration = {
            ...(defaultConfiguration || {}),
            ...(localConfiguration || {}),
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
