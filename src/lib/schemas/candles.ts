import { z } from "zod"

const ACCEPTED_MEDIA_TYPES = [
    "image/jpeg",
    "image/png",
    "video/mp4",
]

const MAX_FILE_SIZE = 5 * 1024 * 1024

export const baseCandleFormSchema = z.object({
    content: z.object({
        en: z.object({ name: z.string(), description: z.string() }),
        ru: z.object({ name: z.string(), description: z.string() }),
        ua: z.object({ name: z.string(), description: z.string() }),
    }),
    quantity: z.number(),
    price: z.number(),
    aroma: z.string(),
    color: z.string(),
    wick: z.string(),
    size: z.string(),
    images: z.array(z.instanceof(File)),
});

export const getCandleFormSchema = (isEdit: boolean) =>
    baseCandleFormSchema.superRefine((data, ctx) => {
        if (!isEdit && data.images.length === 0) {
            ctx.addIssue({ code: "custom", message: "At least one file is required." });
        }

        data.images.forEach((file, index) => {
            if (!ACCEPTED_MEDIA_TYPES.includes(file.type)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Invalid file type at index ${index}`,
                });
            }
            if (file.size > MAX_FILE_SIZE) {
                ctx.addIssue({
                    code: "custom",
                    message: `File size exceeds limit at index ${index}`,
                });
            }
        });
    });


export type CandleFormValues = z.infer<typeof baseCandleFormSchema>;
