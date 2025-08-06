import { z } from 'zod';
import { ERROR_MESSAGES } from '../constant/errorMessages';
import { bankCategorySchema } from './bankCategory.schema';

/**
 * Regular expression for validating 12-digit card ID.
 */
const CARD_ID_REGEX = /^\d{12}$/;

/**
 * Zod schema for validating Connect Bank form data.
 */
export const connectBankSchema = z.object({
  /**
   * Cardholder name, must be non-empty.
   */
  cardholderName: z.string().min(1, ERROR_MESSAGES.CARDHOLDER_NAME_REQUIRED),
  /**
   * Initial balance, must be non-empty.
   */
  balance: z.string().min(1, ERROR_MESSAGES.BALANCE_REQUIRED),
  /**
   * Monthly budget, must be non-empty.
   */
  monthlyBudget: z.string().min(1, ERROR_MESSAGES.MONTHLY_BUDGET_REQUIRED),
  /**
   * Card CVV, must be at least 3 digits.
   */
  cardCvv: z.string().min(3, ERROR_MESSAGES.CARD_CVV_MIN),
  /**
   * Card ID, must be a 12-digit number.
   */
  cardId: z.string().regex(CARD_ID_REGEX, ERROR_MESSAGES.CARD_ID_FORMAT),
  /**
   * Array of bank categories, each with name and color.
   */
  categories: z.array(bankCategorySchema),
});

/**
 * Type inferred from connectBankSchema.
 */
export type ConnectBankSchemaType = z.infer<typeof connectBankSchema>;
