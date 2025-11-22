import { z } from "zod"

export const baseProductFormSchema = z.object({
    category: z.number(),
    content: z.object({
        en: z.object({ name: z.string(), description: z.string() }),
        ru: z.object({ name: z.string(), description: z.string() }),
        ua: z.object({ name: z.string(), description: z.string() }),
    }),
});

export type ProductFormValues = z.infer<typeof baseProductFormSchema>;
