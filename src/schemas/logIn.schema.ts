import { z } from 'zod';
import { ERROR_MESSAGES } from '../constants/errorMessages';

/**
 * Zod schema for validating LogIn form data.
 */
export const LogInSchema = z.object({
  /**
   * Email, must be valid and not exceed 100 characters.
   */
  email: z
    .string()
    .email(ERROR_MESSAGES.EMAIL_INVALID)
    .min(1, ERROR_MESSAGES.REQUIRED)
    .max(100, ERROR_MESSAGES.EMAIL_MAX),

  /**
   * Password, must be 8-60 characters.
   */
  password: z
    .string()
    .min(8, ERROR_MESSAGES.PASSWORD_MIN)
    .refine((val) => val.length <= 60, { message: ERROR_MESSAGES.PASSWORD_TOO_LONG }),
});

/**
 * Type inferred from LogInSchema.
 */
export type LogInSchemaType = z.infer<typeof LogInSchema>;
