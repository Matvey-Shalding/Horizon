import { z } from 'zod';
import { ERROR_MESSAGES } from '../@/constants/errorMessages';

/**
 * Regular expression for validating hex color codes.
 */
const COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/;

/**
 * Zod schema for validating bank category data.
 */
export const bankCategorySchema = z.object({
  /**
   * Category name, must be non-empty.
   */
  name: z.string().min(1, ERROR_MESSAGES.CATEGORY_NAME_REQUIRED),
  /**
   * Category color, must be a valid hex color code.
   */
  color: z.string().regex(COLOR_REGEX, ERROR_MESSAGES.COLOR_FORMAT),
});

/**
 * Type inferred from bankCategorySchema.
 */
export type BankCategorySchemaType = z.infer<typeof bankCategorySchema>;
