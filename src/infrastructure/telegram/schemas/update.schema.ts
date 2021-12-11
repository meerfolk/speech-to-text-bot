import { z } from 'zod';

const UpdateSchema = z.object({
    message: z.object({
        message_id: z.number(),
        chat: z.object({
            id: z.number(),
            first_name: z.string().optional(),
            last_name: z.string().optional(),
        }),
        audio: z.object({
            file_name: z.string(),
            file_id: z.string(),
            file_unique_id: z.string(),
        }).optional(),
    }).optional(),
});

export const UpdateResponseSchema = z.object({
    ok: z.boolean(),
    result: z.array(UpdateSchema),
});


export type Update = z.infer<typeof UpdateSchema>;
