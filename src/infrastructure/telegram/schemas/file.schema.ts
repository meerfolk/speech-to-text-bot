import { z } from 'zod';

const FileSchema = z.object({
    file_id: z.string(),
    file_unique_id: z.string(),
    file_size: z.number(),
    file_path: z.string(),
});

export const FileResponseSchema = z.object({
    ok: z.boolean(),
    result: FileSchema,
});

export type File = z.infer<typeof FileSchema>;
