import { z } from "zod";

export const bankCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, "Color must be in hex format (#xxxxxx)"),
});


export type bankCategorySchemaType = z.infer<typeof bankCategorySchema>;
