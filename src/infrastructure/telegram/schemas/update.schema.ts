import { z } from 'zod';

const UpdateSchema = z.object({
    message: z.object({
        chat: z.object({
            id: z.number(),
        }),
    }).optional(),
});

export const UpdateResponseSchema = z.object({
    ok: z.boolean(),
    result: z.array(UpdateSchema),
});


export type Update = z.infer<typeof UpdateSchema>;
