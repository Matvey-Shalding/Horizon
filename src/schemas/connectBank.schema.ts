import { z } from 'zod';
import { bankCategorySchema } from './bankCategory.schema';
export const connectBankSchema = z.object({
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  balance: z.string().min(1, 'Initial balance is required'),
  monthlyBudget: z.string().min(1, 'Monthly budget is required'),
  cardCvv: z.string().min(3, 'Card CVV must be at least 3 digits'),
  cardId: z.string().regex(/^\d{12}$/, 'Card ID must be a 12-digit number'),
  categories: z.array(bankCategorySchema),
});

export type ConnectBankSchemaType = z.infer<typeof connectBankSchema>;
