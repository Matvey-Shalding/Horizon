import { z } from 'zod';
import { ERROR_MESSAGES } from '../constants/errorMessages';

/**
 * Regular expression for validating date of birth in YYYY-MM-DD format.
 */
const DATE_OF_BIRTH_REGEX = /^(19[0-9]{2}|20[0-2][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

/**
 * Zod schema for validating SignUp form data.
 */
export const SignUpSchema = z.object({
  /**
   * First name, must be 2-50 characters.
   */
  firstName: z
    .string()
    .min(2, ERROR_MESSAGES.NAME_MIN(2))
    .max(50, ERROR_MESSAGES.NAME_MAX(50))
    .nonempty(ERROR_MESSAGES.REQUIRED),

  /**
   * Last name, must be 2-50 characters.
   */
  lastName: z
    .string()
    .min(2, ERROR_MESSAGES.NAME_MIN(2))
    .max(50, ERROR_MESSAGES.NAME_MAX(50))
    .nonempty(ERROR_MESSAGES.REQUIRED),

  /**
   * Address, must be 6-100 characters.
   */
  address: z
    .string()
    .min(6, ERROR_MESSAGES.ADDRESS_MIN)
    .max(100, ERROR_MESSAGES.ADDRESS_MAX)
    .nonempty(ERROR_MESSAGES.REQUIRED),

  /**
   * State, must be 2-50 characters.
   */
  state: z
    .string()
    .min(2, ERROR_MESSAGES.STATE_MIN)
    .max(50, ERROR_MESSAGES.STATE_MAX)
    .nonempty(ERROR_MESSAGES.REQUIRED),

  /**
   * Postal code, must be 2-15 characters.
   */
  postalCode: z
    .string()
    .min(2, ERROR_MESSAGES.POSTAL_CODE_MIN)
    .max(15, ERROR_MESSAGES.POSTAL_CODE_MAX)
    .nonempty(ERROR_MESSAGES.REQUIRED),

  /**
   * Date of birth, must be in YYYY-MM-DD format.
   */
  dateOfBirth: z
    .string()
    .regex(DATE_OF_BIRTH_REGEX, ERROR_MESSAGES.DATE_OF_BIRTH_FORMAT)
    .nonempty(ERROR_MESSAGES.REQUIRED),

  /**
   * SSN, must be 2-15 characters.
   */
  SSN: z
    .string()
    .min(2, ERROR_MESSAGES.SSN_MIN)
    .max(15, ERROR_MESSAGES.SSN_MAX)
    .nonempty(ERROR_MESSAGES.REQUIRED),

  /**
   * Email, must be a valid email address.
   */
  email: z.string().email(ERROR_MESSAGES.EMAIL_INVALID).nonempty(ERROR_MESSAGES.REQUIRED),

  /**
   * Password, must be 8-15 characters.
   */
  password: z
    .string()
    .min(8, ERROR_MESSAGES.PASSWORD_MIN)
    .max(15, ERROR_MESSAGES.PASSWORD_MAX)
    .nonempty(ERROR_MESSAGES.REQUIRED),
});

/**
 * Type inferred from SignUpSchema.
 */
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
