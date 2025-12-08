import { z } from "zod"

const ACCEPTED_MEDIA_TYPES = [
    "image/jpeg",
    "image/png",
    "video/mp4",
]

const MAX_FILE_SIZE = 5 * 1024 * 1024

export const baseProductVariantFormSchema = z.object({
    product: z.number(),
    quantity: z.number(),
    price: z.number(),
    attributes: z.record(z.string(), z.number()),
    images: z.array(z.instanceof(File)),
});

export const getCandleFormSchema = (isEdit: boolean) =>
    baseProductVariantFormSchema.superRefine((data, ctx) => {
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


export type ProductVariantFormValues = z.infer<typeof baseProductVariantFormSchema>;
