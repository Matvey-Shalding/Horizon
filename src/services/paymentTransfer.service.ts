import { Dispatch } from '@reduxjs/toolkit';
import { UseFormClearErrors } from 'react-hook-form';
import { PaymentTransferSchemaType } from 'schemas/paymentTransfer.schema';
import { setBanks } from 'state/main/bankSlice';
import { Bank } from 'types/Bank.interface';
import { TransactionStatus } from 'types/Transaction.interface';

/**
 * Parameters for resetting form state.
 */
interface ResetParams {
  reset: () => void;
  clearErrors: UseFormClearErrors<PaymentTransferSchemaType>;
}

/**
 * Parameters for transferring funds, extending schema and reset params.
 */
interface TransferParams extends PaymentTransferSchemaType, ResetParams {
  banks: Bank[];
  dispatch: Dispatch;
}

/**
 * Service for handling payment transfers and form state management.
 */
class PaymentTransferService {
  /**
   * Resets the form and UI state after a transfer or cancellation.
   * @param params - Parameters for resetting form state.
   */
  resetFormState({ reset, clearErrors }: ResetParams): void {
    reset();
    clearErrors();
  }

  /**
   * Processes a fund transfer between banks and updates state.
   * @param params - Parameters for the transfer operation.
   */
  transferFunds({
    sourceBank,
    recipientAccount,
    balance,
    categoryId,
    note,
    banks,
    dispatch,
    reset,
    clearErrors,
  }: TransferParams): void {
    const sourceIndex = banks.findIndex((b) => b.cardId === sourceBank);
    const recipIndex = banks.findIndex((b) => b.cardId === recipientAccount);
    if (sourceIndex === -1 || recipIndex === -1) return;

    const amount = Number(balance);
    const now = new Date();
    const formattedDate = now
      .toLocaleString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(',', '');

    // Deep clone banks and nested categories
    const updatedBanks = banks.map((b) => ({
      ...b,
      categories: b.categories.map((c) => ({ ...c })),
      transactions: [...b.transactions],
    }));

    // Locate source bank + category
    const source = updatedBanks[sourceIndex];
    const categoryIdx = source.categories.findIndex((c) => c.name === categoryId);
    if (categoryIdx === -1) return;
    const srcCategory = source.categories[categoryIdx];

    // Build transaction payload
    const txBase = {
      id: crypto.randomUUID(),
      status: 'SUCCESS' as TransactionStatus,
      date: formattedDate,
      category: srcCategory,
      message: note,
    };

    // 1) Update source bank
    source.balance = String(Number(source.balance) - amount);
    source.transactions.push({
      ...txBase,
      amount: balance,
      recipientBankId: recipientAccount,
    });
    // Increment the source category's expenses
    source.categories[categoryIdx] = {
      ...srcCategory,
      expenses: String(Number(srcCategory.expenses) + amount),
    };

    // 2) Update recipient bank
    const recip = updatedBanks[recipIndex];
    recip.balance = String(Number(recip.balance) + amount);
    recip.transactions.push({
      ...txBase,
      amount: balance,
      recipientBankId: sourceBank,
    });

    // Dispatch and reset
    dispatch(setBanks(updatedBanks));
    this.resetFormState({ reset, clearErrors });
  }
}

export const paymentTransferService = new PaymentTransferService();
