export class UploadFileModel {
    constructor(
        public readonly name: string,
        public readonly fullName: string,
        public readonly file: Buffer,
    ) {}
}
