import { z } from "zod";
import { bankCategorySchema } from "./bankCategory.schema";

/**
 * Zod schema for the Edit Category form.
 * This validates an array of bank categories, each with a name, budget, and color.
 */
export const editCategorySchema = z.object({
  categories: z.array(bankCategorySchema),
});

/**
 * TypeScript type inferred from `editCategorySchema`.
 * Represents the shape of form data for editing multiple categories.
 */
export type EditCategory = z.infer<typeof editCategorySchema>;
