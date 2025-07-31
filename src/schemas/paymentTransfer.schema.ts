// src/schemas/paymentTransfer.schema.ts
import { Bank } from 'types/Bank.interface'; // adjust import if needed
import { z } from 'zod';

export const getPaymentTransferSchema = (banks: Bank[]) =>
  z
    .object({
      sourceBank: z.string().min(1, 'Please select a source bank'),
      recipientAccount: z.string().min(1, 'Please select a recipient bank'),
      balance: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
      note: z.string().optional(),
      categoryId: z.string().min(1, 'Please select a category'),
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
        message: 'Insufficient balance in the selected bank',
      }
    );

export type PaymentTransferSchemaType = z.infer<ReturnType<typeof getPaymentTransferSchema>>;
