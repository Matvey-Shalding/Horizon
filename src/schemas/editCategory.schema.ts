import { z } from 'zod';
import { bankCategorySchema } from './bankCategory.schema';

/**
 * Zod schema for validating Edit Category form data.
 */
export const editCategorySchema = z.object({
  /**
   * Array of bank categories, each with name and color.
   */
  categories: z.array(bankCategorySchema),
});

/**
 * Type inferred from editCategorySchema.
 */
export type EditCategorySchemaType = z.infer<typeof editCategorySchema>;
