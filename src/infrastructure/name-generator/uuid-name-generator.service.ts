import { v4 as uuid } from 'uuid';

import { INameGeneratorService } from '../../domain/interfaces';

export class UUIDNameGeneratorService implements INameGeneratorService {
    public generate(): string {
        return uuid();
    } 
}
