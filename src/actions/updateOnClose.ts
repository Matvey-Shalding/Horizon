'use server';

import { Database } from 'database/database';

export async function updateOnClose(user: any, banks: { [key: string]: any }[]) {
  try {
    const existingBanks = await Database.bank.findMany({
      where: { userId: user.id },
      include: { categories: true, transactions: true },
    });

    const passedCardIds = banks.map((b) => b.cardId);

    // 2. Delete removed banks
    const banksToDelete = existingBanks.filter(
      (existingBank) => !passedCardIds.includes(existingBank.cardId)
    );
    for (const bank of banksToDelete) {
      await Database.bank.delete({ where: { cardId: bank.cardId } });
    }

    // 3. Upsert banks, categories, and transactions
    for (const bank of banks) {
      // Upsert bank
      const updatedBank = await Database.bank.upsert({
        where: { cardId: bank.cardId },
        update: {
          balance: bank.balance,
          monthlyBudget: bank.monthlyBudget,
          cardholderName: bank.cardholderName,
          cardCvv: bank.cardCvv,
        },
        create: {
          cardId: bank.cardId,
          balance: bank.balance,
          monthlyBudget: bank.monthlyBudget,
          cardholderName: bank.cardholderName,
          cardCvv: bank.cardCvv,
          userId: user.id,
        },
      });

      // Upsert categories
      const existingCategories = await Database.category.findMany({
        where: { bankId: updatedBank.cardId },
      });

      const incomingCategories = bank.categories || [];
      const incomingCategoryMap = new Map<string, any>();
      for (const cat of incomingCategories) {
        const nameKey = cat.name.trim().toLowerCase();
        if (!incomingCategoryMap.has(nameKey)) {
          incomingCategoryMap.set(nameKey, cat);
        }
      }

      // Delete missing categories
      for (const existing of existingCategories) {
        const nameKey = existing.name.trim().toLowerCase();
        if (!incomingCategoryMap.has(nameKey)) {
          await Database.category.delete({ where: { id: existing.id } });
        }
      }

      // Update or create categories
      for (const [nameKey, category] of incomingCategoryMap) {
        const existingCategory = existingCategories.find((c) => c.name.trim().toLowerCase() === nameKey);

        if (existingCategory) {
          await Database.category.update({
            where: { id: existingCategory.id },
            data: {
              name: category.name,
              expenses: category.expenses ?? '',
              color: category.color,
            },
          });
        } else {
          await Database.category.create({
            data: {
              name: category.name,
              expenses: category.expenses ?? '',
              color: category.color,
              bankId: updatedBank.cardId,
            },
          });
        }
      }

      // Upsert transactions
      const existingTransactions = await Database.transaction.findMany();

      for (const tx of bank.transactions) {
        const exists = existingTransactions.find((serverTransaction) => {
          return serverTransaction.id === tx.id && serverTransaction.bankId === bank.cardId;
        });

        if (!exists) {
          await Database.transaction.create({
            data: {
              id: tx.transaction,
              amount: tx.amount,
              status: tx.status,
              date: tx.date,
              category: tx.category ?? '',
              message: tx.message ?? '',
              bankId: bank.cardId,
              recipientBankId: tx.recipientBankId,
            },
          });
        }
      }
    }
    await Database.transaction.deleteMany({
      where: {
        OR: [
          { bankId: { notIn: passedCardIds } },
          {
            AND: [{ recipientBankId: { not: undefined } }, { recipientBankId: { notIn: passedCardIds } }],
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error updating user, bank, categories, or transactions:', error);
    throw new Error('Failed to update data');
  }
}
