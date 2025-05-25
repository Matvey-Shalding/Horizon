import { Dispatch } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { UseFormClearErrors } from "react-hook-form";
import { PaymentTransferSchemaType } from "schemas/paymentTransfer.schema";
import { setBanks } from "state/main/bankSlice";
import { Bank } from "types/Bank.interface";
import { Category } from "types/Category.interface";
import { TransactionStatus } from "types/Transaction.interface";

type ResetParams = {
  reset: () => void;
  clearErrors: UseFormClearErrors<PaymentTransferSchemaType>;
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
    categoryId,
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
    const date = new Date();

    const weekday = date.toLocaleString("en-US", { weekday: "short" }); // Wed
    const day = String(date.getDate()).padStart(2, "0"); // 28
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 08
    const year = date.getFullYear(); // 2025
    const hours = String(date.getHours()).padStart(2, "0"); // 13
    const minutes = String(date.getMinutes()).padStart(2, "0"); // 00

    // Format string
    const formatted = `${weekday} ${day}.${month}.${year}, ${hours}:${minutes}`;

    const category = banks
      .find((currentBank) => currentBank.cardId === sourceBank)
      ?.categories.find((c) => c.name === categoryId) as Category;

    const transaction = {
      id: transactionId,
      status: "SUCCESS" as TransactionStatus,
      date: formatted,
      category,
      message: note,
      //For plus and for minus it`s source bank
    };

    copy[sourceBankIndex].balance = String(
      Number(copy[sourceBankIndex].balance) - Number(balance),
    );
    copy[recipientBankIndex].balance = String(
      Number(copy[recipientBankIndex].balance) + Number(balance),
    );

    copy[sourceBankIndex].transactions.push({
      ...transaction,
      amount: "- " + balance,
      recipientBankId: recipientAccount,
    });
    copy[recipientBankIndex].transactions.push({
      ...transaction,
      amount: "+" + balance,
      recipientBankId: sourceBank,
    });

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
