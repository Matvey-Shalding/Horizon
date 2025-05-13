"use server";

import { Database } from "database/database";
import _ from "lodash";

export async function updateOnClose(user: any, banks: any[]) {
  console.log("Bank data to send:", banks);

  try {
    // Step 1: Get all existing banks for the user
    const existingBanks = await Database.bank.findMany({
      where: { userId: user.id },
      include: { categories: true, transactions: true }, // in case you want to handle children manually
    });

    const passedCardIds = banks.map((b) => b.cardId);

    // Step 2: Delete banks that are NOT present in the new `banks` array
    const banksToDelete = existingBanks.filter(
      (existingBank) => !passedCardIds.includes(existingBank.cardId),
    );

    for (const bank of banksToDelete) {
      await Database.bank.delete({
        where: { cardId: bank.cardId },
      });
    }

    // Step 3: Upsert remaining banks and categories
    for (const bank of banks) {
      // Upsert the bank
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

      // Sync categories
      const existingCategories = await Database.category.findMany({
        where: { bankId: updatedBank.cardId },
      });

      const incomingCategoryNames = bank.categories.map((cat: any) => cat.name);

      // Delete removed categories
      for (const existing of existingCategories) {
        if (!incomingCategoryNames.includes(existing.name)) {
          await Database.category.delete({
            where: { id: existing.id },
          });
          console.log(`Deleted category ${existing.name}`);
        }
      }

      // Update or create categories
      for (const category of bank.categories) {
        const existingCategory = _.find(
          existingCategories,
          (existing) => existing.name === category.name,
        );

        if (existingCategory) {
          await Database.category.update({
            where: { id: existingCategory.id },
            data: {
              name: category.name,
              expenses: category.expenses,
              color: category.color,
            },
          });
        } else {
          await Database.category.create({
            data: {
              name: category.name,
              expenses: category.expenses,
              color: category.color,
              bankId: updatedBank.cardId,
            },
          });
        }
      }
    }

    return { message: "User, bank, and categories updated successfully" };
  } catch (error) {
    console.error("Error updating user, bank, or categories:", error);
    throw new Error("Failed to update data");
  }
}
