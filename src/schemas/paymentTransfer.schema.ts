import { Bank } from 'types/Bank.interface';
import { z } from 'zod';
import { ERROR_MESSAGES } from '../constants/errorMessages';

/**
 * Regular expression for validating balance amount (up to 2 decimal places).
 */
const BALANCE_REGEX = /^\d+(\.\d{1,2})?$/;

/**
 * Creates a Zod schema for validating payment transfer form data.
 * @param banks - Array of available banks for balance validation.
 * @returns Zod schema for payment transfer.
 */
export const getPaymentTransferSchema = (banks: Bank[]) =>
  z
    .object({
      /**
       * Source bank ID, must be non-empty.
       */
      sourceBank: z.string().min(1, ERROR_MESSAGES.BANK_SELECT),
      /**
       * Recipient account ID, must be non-empty.
       */
      recipientAccount: z.string().min(1, ERROR_MESSAGES.RECIPIENT_SELECT),
      /**
       * Balance amount, must be a valid number with up to 2 decimal places.
       */
      balance: z.string().regex(BALANCE_REGEX, ERROR_MESSAGES.BALANCE_FORMAT),
      /**
       * Optional note for the transfer.
       */
      note: z.string().optional(),
      /**
       * Category ID, must be non-empty.
       */
      categoryId: z.string().min(1, ERROR_MESSAGES.CATEGORY_SELECT),
    })
    .refine(
      (data) => {
        if (!data.sourceBank || !banks.length) return true;
        const currentAmount = parseFloat(data.balance);
        const currentBalance = Number(banks.find((bank) => bank.cardId === data.sourceBank)?.balance) ?? 0;
        return currentBalance > currentAmount;
      },
      {
        path: ['balance'],
        message: ERROR_MESSAGES.BALANCE_INSUFFICIENT,
      }
    );

/**
 * Type inferred from paymentTransferSchema.
 */
export type PaymentTransferSchemaType = z.infer<ReturnType<typeof getPaymentTransferSchema>>;
