'use server';

import { Database } from 'database/database';

export async function updateOnClose(user: any, banks: { [key: string]: any }[]) {
  console.log('Banks TO DB');
  console.dir(banks, { depth: null });

  try {
    function generateCuid(): string {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = 'c_';
      for (let i = 0; i < 23; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    // Helper function to generate a random date within the last 365 days
    function getRandomDate(): string {
      const daysBack = Math.floor(Math.random() * 365);
      const date = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    // Helper function to generate a random amount between 0 and 1000
    function getRandomAmount(): string {
      return (Math.random() * 1000).toFixed(2);
    }

    async function insertBanksWithCategoriesAndTransactions(userId: string) {
      console.log('Inserting banks, categories, and transactions to DB for user:', userId);

      const banks = [
        {
          cardId: 'bank1_card_20250601_1',
          cardholderName: 'John Doe',
          balance: 1000.0,
          monthlyBudget: 500.0,
          cardCvv: '123',
          userId: userId,
        },
        {
          cardId: 'bank2_card_20250601_2',
          cardholderName: 'Jane Smith',
          balance: 2000.0,
          monthlyBudget: 600.0,
          cardCvv: '456',
          userId: userId,
        },
        {
          cardId: 'bank3_card_20250601_3',
          cardholderName: 'Alice Johnson',
          balance: 1500.0,
          monthlyBudget: 400.0,
          cardCvv: '789',
          userId: userId,
        },
        {
          cardId: 'bank4_card_20250601_4',
          cardholderName: 'Bob Brown',
          balance: 3000.0,
          monthlyBudget: 700.0,
          cardCvv: '012',
          userId: userId,
        },
        {
          cardId: 'bank5_card_20250601_5',
          cardholderName: 'Carol White',
          balance: 2500.0,
          monthlyBudget: 550.0,
          cardCvv: '345',
          userId: userId,
        },
      ];

      const categories = [
        { name: 'Food', expenses: '300', color: '#FF6F61' },
        { name: 'Transport', expenses: '150', color: '#4CAF50' },
        { name: 'Entertainment', expenses: '100', color: '#2196F3' },
        { name: 'Shopping', expenses: '200', color: '#FFC107' },
        { name: 'Bills', expenses: '400', color: '#9C27B0' },
      ];

      const bankCardIds = banks.map((bank) => bank.cardId);

      try {
        // Check if user exists
        const userExists = await Database.user.findUnique({
          where: { id: userId },
        });
        if (!userExists) {
          throw new Error(`User with ID ${userId} not found`);
        }

        // Insert banks, categories, and transactions
        for (const bank of banks) {
          // Check if bank exists
          const existingBank = await Database.bank.findUnique({
            where: { cardId: bank.cardId },
          });

          if (!existingBank) {
            await Database.bank.create({
              data: {
                cardId: bank.cardId,
                cardholderName: bank.cardholderName,
                balance: bank.balance,
                monthlyBudget: bank.monthlyBudget,
                cardCvv: bank.cardCvv,
                userId: bank.userId,
              },
            });
            console.log(`Inserted bank ${bank.cardId} for user ${userId}`);
          } else {
            console.log(`Bank ${bank.cardId} already exists, skipping bank creation`);
          }

          // Insert categories for this bank
          for (const category of categories) {
            const existingCategory = await Database.category.findFirst({
              where: {
                bankId: bank.cardId,
                name: category.name,
              },
            });

            if (!existingCategory) {
              await Database.category.create({
                data: {
                  id: generateCuid(),
                  name: category.name,
                  expenses: category.expenses,
                  color: category.color,
                  bankId: bank.cardId,
                },
              });
              console.log(`Inserted category ${category.name} for bank ${bank.cardId}`);
            } else {
              console.log(`Category ${category.name} for bank ${bank.cardId} already exists, skipping`);
            }
          }

          // Insert 5 transactions for this bank
          for (let i = 0; i < 5; i++) {
            const category = categories[i % categories.length];
            const transactionId = generateCuid();

            const existingTransaction = await Database.transaction.findUnique({
              where: { id: transactionId },
            });

            if (!existingTransaction) {
              await Database.transaction.create({
                data: {
                  id: transactionId,
                  amount: getRandomAmount(),
                  status: 'SUCCESS',
                  date: getRandomDate(),
                  category: {
                    name: category.name,
                    budget: parseInt(category.expenses),
                  },
                  message: '',
                  bankId: bank.cardId,
                  recipientBankId: bankCardIds[Math.floor(Math.random() * bankCardIds.length)],
                },
              });
              console.log(`Inserted transaction ${transactionId} for bank ${bank.cardId}`);
            } else {
              console.log(`Transaction ${transactionId} already exists, skipping`);
            }
          }
        }

        return {
          message: 'Successfully inserted banks, categories, and transactions',
        };
      } catch (error) {
        console.error('Error inserting banks, categories, or transactions:', error);
        throw new Error('Failed to insert banks, categories, or transactions');
      }
    }

    // Execute the function with the specified userId
    insertBanksWithCategoriesAndTransactions('07fc337d-402b-4f71-8dca-f9d94b7d9170').catch((error) => {
      console.error('Failed to execute insertBanksWithCategoriesAndTransactions:', error);
    });

    // // 1. Fetch existing banks
    // const existingBanks = await Database.bank.findMany({
    //   where: { userId: user.id },
    //   include: { categories: true, transactions: true },
    // });

    // const passedCardIds = banks.map((b) => b.cardId);

    // // 2. Delete removed banks
    // const banksToDelete = existingBanks.filter(
    //   (existingBank) => !passedCardIds.includes(existingBank.cardId),
    // );

    // for (const bank of banksToDelete) {
    //   await Database.bank.delete({ where: { cardId: bank.cardId } });
    // }

    // // 3. Upsert banks, categories, and transactions
    // for (const bank of banks) {
    //   // Upsert bank
    //   const updatedBank = await Database.bank.upsert({
    //     where: { cardId: bank.cardId },
    //     update: {
    //       balance: bank.balance,
    //       monthlyBudget: bank.monthlyBudget,
    //       cardholderName: bank.cardholderName,
    //       cardCvv: bank.cardCvv,
    //     },
    //     create: {
    //       cardId: bank.cardId,
    //       balance: bank.balance,
    //       monthlyBudget: bank.monthlyBudget,
    //       cardholderName: bank.cardholderName,
    //       cardCvv: bank.cardCvv,
    //       userId: user.id,
    //     },
    //   });

    //   // Upsert categories
    //   const existingCategories = await Database.category.findMany({
    //     where: { bankId: updatedBank.cardId },
    //   });

    //   const incomingCategories = bank.categories || [];

    //   const incomingCategoryMap = new Map<string, any>();
    //   for (const cat of incomingCategories) {
    //     const nameKey = cat.name.trim().toLowerCase();
    //     if (!incomingCategoryMap.has(nameKey)) {
    //       incomingCategoryMap.set(nameKey, cat);
    //     }
    //   }

    //   // Delete missing categories
    //   for (const existing of existingCategories) {
    //     const nameKey = existing.name.trim().toLowerCase();
    //     if (!incomingCategoryMap.has(nameKey)) {
    //       await Database.category.delete({ where: { id: existing.id } });
    //       console.log(`Deleted category ${existing.name}`);
    //     }
    //   }

    //   // Update or create categories
    //   for (const [nameKey, category] of incomingCategoryMap) {
    //     const existingCategory = existingCategories.find(
    //       (c) => c.name.trim().toLowerCase() === nameKey,
    //     );

    //     if (existingCategory) {
    //       await Database.category.update({
    //         where: { id: existingCategory.id },
    //         data: {
    //           name: category.name,
    //           expenses: category.expenses ?? "",
    //           color: category.color,
    //         },
    //       });
    //     } else {
    //       await Database.category.create({
    //         data: {
    //           name: category.name,
    //           expenses: category.expenses ?? "",
    //           color: category.color,
    //           bankId: updatedBank.cardId,
    //         },
    //       });
    //     }
    //   }

    //   // await Database.transaction.deleteMany({})

    //   const existingTransactions = await Database.transaction.findMany();

    //     for (const tx of bank.transactions) {
    //       if (
    //         !existingTransactions.find((serverTransaction) => {
    //           return (
    //             serverTransaction.id === tx.id &&
    //             serverTransaction.bankId === bank.cardId
    //           );
    //         })
    //       ) {
    //         await Database.transaction.create({
    //           data: {
    //             id: tx.transaction,
    //             amount: tx.amount,
    //             status: tx.status,
    //             date: tx.date,
    //             category: tx.category ?? "",
    //             message: tx.message ?? "",
    //             bankId: bank.cardId,
    //             recipientBankId: tx.recipientBankId,
    //           },
    //         });
    //       }
    //     }
    // }

    return {
      message: 'User, bank, categories, and transactions updated successfully',
    };
  } catch (error) {
    console.error('Error updating user, bank, categories, or transactions:', error);
    throw new Error('Failed to update data');
  }
}
