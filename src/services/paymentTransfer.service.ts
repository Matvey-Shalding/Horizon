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
  private resetFormState({ reset, clearErrors }: ResetParams): void {
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
    const sourceBankIndex = banks.findIndex((bank) => bank.cardId === sourceBank);
    const recipientBankIndex = banks.findIndex((bank) => bank.cardId === recipientAccount);

    if (sourceBankIndex === -1 || recipientBankIndex === -1) return;

    const updatedBanks = [...banks];
    const amount = Number(balance);
    const date = new Date();
    const formattedDate = date
      .toLocaleString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(/,/, '');

    const category = banks[sourceBankIndex].categories.find((c) => c.name === categoryId)!;

    const transaction = {
      id: crypto.randomUUID(),
      status: 'SUCCESS' as TransactionStatus,
      date: formattedDate,
      category,
      message: note,
    };

    updatedBanks[sourceBankIndex] = {
      ...updatedBanks[sourceBankIndex],
      balance: String(Number(updatedBanks[sourceBankIndex].balance) - amount),
      transactions: [
        ...updatedBanks[sourceBankIndex].transactions,
        {
          ...transaction,
          amount: `- ${balance}`,
          recipientBankId: recipientAccount,
        },
      ],
    };

    updatedBanks[recipientBankIndex] = {
      ...updatedBanks[recipientBankIndex],
      balance: String(Number(updatedBanks[recipientBankIndex].balance) + amount),
      transactions: [
        ...updatedBanks[recipientBankIndex].transactions,
        {
          ...transaction,
          amount: `+${balance}`,
          recipientBankId: sourceBank,
        },
      ],
    };

    dispatch(setBanks(updatedBanks));
    this.resetFormState({ reset, clearErrors });
  }
}

export const paymentTransferService = new PaymentTransferService();
