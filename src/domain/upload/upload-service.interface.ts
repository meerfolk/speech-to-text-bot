export interface IUploadService {
    upload: (name: string, file: Buffer) => Promise<void>;
}
