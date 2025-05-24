import { cloneDeep } from "lodash";
import { Dispatch } from "@reduxjs/toolkit";
import { setBanks } from "state/main/bankSlice";
import { Bank } from "types/Bank.interface";
import { Transaction } from "types/Transaction.interface";
import { PaymentTransferSchemaType } from "schemas/paymentTransfer.schema";
import { UseFormClearErrors } from 'react-hook-form';

type ResetParams = {
  reset: () => void;
  clearErrors: UseFormClearErrors<{
    sourceBank: string;
    recipientAccount: string;
    balance: string;
    note?: string | undefined;
    category?: string | undefined;
}>;
  // setSelectedBank: (id: string) => void;
  // setSelectedCategory: (category: string) => void;
  // setIsCategoryDropdownOpen: (open: boolean) => void;
  // setIsDropdownOpen: (open: boolean) => void;
};

type TransferParams = PaymentTransferSchemaType &
  ResetParams & {
    banks: Bank[];
    dispatch: Dispatch;
  };

export class PaymentTransferService {
  resetFormState({
    reset,
    clearErrors,
    // setSelectedBank,
    // setSelectedCategory,
    // setIsCategoryDropdownOpen,
    // setIsDropdownOpen,
  }: ResetParams) {
    reset();
    clearErrors();
    // setSelectedBank("");
    // setSelectedCategory("");
    // setIsCategoryDropdownOpen(false);
    // setIsDropdownOpen(false);
  }

  transferFunds({
    sourceBank,
    recipientAccount,
    balance,
    category,
    note,
    banks,
    dispatch,
    reset,
    clearErrors,
    // setSelectedBank,
    // setSelectedCategory,
    // setIsCategoryDropdownOpen,
    // setIsDropdownOpen,
  }: TransferParams) {
    const copy = cloneDeep(banks);

    const sourceBankIndex = copy.findIndex(
      (bank) => bank.cardId === sourceBank,
    );
    const recipientBankIndex = copy.findIndex(
      (bank) => bank.cardId === recipientAccount,
    );

    if (sourceBankIndex === -1 || recipientBankIndex === -1) return;

    const transactionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const transaction: Transaction = {
      id: transactionId,
      amount: balance,
      status: "SUCCESS",
      date: now,
      category,
      message: note,
    };

    copy[sourceBankIndex].balance = String(
      Number(copy[sourceBankIndex].balance) - Number(balance),
    );
    copy[recipientBankIndex].balance = String(
      Number(copy[recipientBankIndex].balance) + Number(balance),
    );

    copy[sourceBankIndex].transactions.push({ ...transaction });
    copy[recipientBankIndex].transactions.push({ ...transaction });

    dispatch(setBanks(copy));

    // Use the reset helper to clean form/UI state after transfer
    this.resetFormState({
      reset,
      clearErrors,
      // setSelectedBank,
      // setSelectedCategory,
      // setIsCategoryDropdownOpen,
      // setIsDropdownOpen,
    });
  }
}

export const paymentTransferService = new PaymentTransferService();
