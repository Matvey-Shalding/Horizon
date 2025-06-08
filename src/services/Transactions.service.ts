import { subDays } from "date-fns";
import { Transaction } from "types/Transaction.interface";
import { Bank } from "types/Bank.interface";
import { Category } from "types/Category.interface";

interface CategoryWithBank extends Category {
  bank: { cardId: string; cardholderName: string };
}

interface FilterState {
  datePreset: "today" | "last7" | "last30Days" | null;
  dateRange: { from: Date; to: Date } | undefined;
  amountRange: [number, number];
  selectedCategories: CategoryWithBank[];
  selectedBanks: Bank[];
  transactions: Transaction[];
}

export class TransactionFilterService {
  static setDatePreset(preset: "today" | "last7" | "last30Days" | null): {
    datePreset: "today" | "last7" | "last30Days" | null;
    dateRange: { from: Date; to: Date } | undefined;
  } {
    if (preset) {
      let from: Date, to: Date;
      if (preset === "today") {
        from = new Date();
        from.setHours(0, 0, 0, 0);
        to = new Date();
        to.setHours(23, 59, 59, 999);
      } else if (preset === "last7") {
        from = subDays(new Date(), 7);
        from.setHours(0, 0, 0, 0);
        to = new Date();
        to.setHours(23, 59, 59, 999);
      } else {
        from = subDays(new Date(), 30);
        from.setHours(0, 0, 0, 0);
        to = new Date();
        to.setHours(23, 59, 59, 999);
      }
      return { datePreset: preset, dateRange: { from, to } };
    }
    return { datePreset: null, dateRange: undefined };
  }

  static getFilteredTransactions(state: FilterState): Transaction[] {
    return state.transactions.filter((tx) => {
      let ok = true;

      const txDate = new Date(tx.date);
      if (isNaN(txDate.getTime())) return false;

      if (state.dateRange) {
        const from = new Date(state.dateRange.from);
        from.setHours(0, 0, 0, 0);
        const to = new Date(state.dateRange.to);
        to.setHours(23, 59, 59, 999);
        ok = ok && txDate >= from && txDate <= to;
      }

      const amt = parseFloat(String(tx.amount).replace(/[^0-9.-]+/g, ""));
      ok = ok && amt >= state.amountRange[0] && amt <= state.amountRange[1];

      if (state.selectedCategories.length > 0) {
        ok =
          ok &&
          state.selectedCategories.some((cat) => tx.category.name === cat.name);
      }

      if (state.selectedBanks.length > 0) {
        ok =
          ok &&
          state.selectedBanks.some(
            (bank) => tx.recipientBankId === bank.cardId,
          );
      }

      return ok;
    });
  }

  static getFilteredBanks(banks: Bank[], searchTerm: string): Bank[] {
    return searchTerm
      ? banks.filter((bank) =>
          bank.cardholderName.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : banks;
  }

  static getFilteredCategories(
    categories: CategoryWithBank[],
    searchTerm: string,
  ): CategoryWithBank[] {
    return searchTerm
      ? categories.filter((cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : categories;
  }

  static isFiltered(state: FilterState, initialState: FilterState): boolean {
    return (
      state.datePreset !== initialState.datePreset ||
      state.dateRange !== initialState.dateRange ||
      state.amountRange[0] !== initialState.amountRange[0] ||
      state.amountRange[1] !== initialState.amountRange[1] ||
      state.selectedCategories.length !==
        initialState.selectedCategories.length ||
      state.selectedBanks.length !== initialState.selectedBanks.length
    );
  }
}

export const transactionFilterService = TransactionFilterService;


