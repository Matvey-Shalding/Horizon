"use server";

import { Database } from "database/database";

export async function updateOnClose(
  user: any,
  banks: { [key: string]: any }[],
) {
  console.log("Banks TO DB");
  console.dir(banks, { depth: null });

  try {
    // Step 1: Get all existing banks for the user
    const existingBanks = await Database.bank.findMany({
      where: { userId: user.id },
      include: { categories: true, transactions: true },
    });

    const passedCardIds = banks.map((b) => b.cardId);

    // Step 2: Delete banks not present in the new banks array
    const banksToDelete = existingBanks.filter(
      (existingBank) => !passedCardIds.includes(existingBank.cardId),
    );

    for (const bank of banksToDelete) {
      await Database.bank.delete({ where: { cardId: bank.cardId } });
    }

    // Step 3: Upsert remaining banks
    for (const bank of banks) {
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

      // Handle categories
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

      const incomingNames = Array.from(incomingCategoryMap.keys());

      // Delete removed categories
      for (const existing of existingCategories) {
        const nameKey = existing.name.trim().toLowerCase();
        if (!incomingCategoryMap.has(nameKey)) {
          await Database.category.delete({ where: { id: existing.id } });
          console.log(`Deleted category ${existing.name}`);
        }
      }

      // Update or create categories
      for (const [nameKey, category] of incomingCategoryMap) {
        const existingCategory = existingCategories.find(
          (c) => c.name.trim().toLowerCase() === nameKey,
        );

        if (existingCategory) {
          await Database.category.update({
            where: { id: existingCategory.id },
            data: {
              name: category.name,
              expenses: category.expenses ?? "",
              color: category.color,
            },
          });
        } else {
          await Database.category.create({
            data: {
              name: category.name,
              expenses: category.expenses ?? "",
              color: category.color,
              bankId: updatedBank.cardId,
            },
          });
        }
      }

      // ✅ Handle transactions too (just like categories)
      const existingTransactions = await Database.transaction.findMany({
        where: { bankId: updatedBank.cardId },
      });

      const incomingTransactions = bank.transactions || [];

      const existingTransactionIds = new Set(
        existingTransactions.map((t) => t.id),
      );
      const incomingTransactionIds = new Set(
        incomingTransactions.map((t: any) => t.transaction),
      );

      // Delete transactions no longer present
      for (const existing of existingTransactions) {
        if (!incomingTransactionIds.has(existing.id)) {
          await Database.transaction.delete({ where: { id: existing.id } });
        }
      }

      // Create or update transactions
      for (const tx of incomingTransactions) {
        if (existingTransactionIds.has(tx.transaction)) {
          // Optionally update existing (you can skip if they’re immutable)
          await Database.transaction.update({
            where: { id: tx.transaction },
            data: {
              amount: tx.amount,
              status: tx.status,
              date: tx.date,
              category: tx.category ?? "",
              message: tx.message ?? "",
              bankId: updatedBank.cardId,
            },
          });
        } else {
          await Database.transaction.create({
            data: {
              id: tx.transaction,
              amount: tx.amount,
              status: tx.status,
              date: tx.date,
              category: tx.category ?? "",
              message: tx.message ?? "",
              bankId: updatedBank.cardId,
            },
          });
        }
      }
    }

    return {
      message: "User, bank, categories, and transactions updated successfully",
    };
  } catch (error) {
    console.error(
      "Error updating user, bank, categories, or transactions:",
      error,
    );
    throw new Error("Failed to update data");
  }
}
