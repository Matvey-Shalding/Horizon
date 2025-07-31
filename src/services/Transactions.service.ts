import { subDays } from 'date-fns';
import { Transaction } from 'types/Transaction.interface';
import { Bank } from 'types/Bank.interface';
import { Category } from 'types/Category.interface';

interface CategoryWithBank extends Category {
  bank: { cardId: string; cardholderName: string };
}

interface FilterState {
  datePreset: 'today' | 'last7' | 'last30Days' | null;
  dateRange: { from: Date; to: Date } | undefined;
  amountRange: [number, number];
  selectedCategories: CategoryWithBank[];
  selectedBanks: Bank[];
  transactions: Transaction[];
}

/**
 * Service class for filtering transactions based on various criteria.
 */
export class TransactionFilterService {
  /**
   * Sets date preset and corresponding date range.
   * @param preset - Date preset ('today', 'last7', 'last30Days', or null).
   * @returns Object with date preset and range.
   */
  static setDatePreset(preset: 'today' | 'last7' | 'last30Days' | null): {
    datePreset: 'today' | 'last7' | 'last30Days' | null;
    dateRange: { from: Date; to: Date } | undefined;
  } {
    if (preset) {
      let from: Date,
        to: Date = new Date();
      to.setHours(23, 59, 59, 999);

      if (preset === 'today') {
        from = new Date();
        from.setHours(0, 0, 0, 0);
      } else {
        from = subDays(to, preset === 'last7' ? 7 : 30);
        from.setHours(0, 0, 0, 0);
      }
      return { datePreset: preset, dateRange: { from, to } };
    }
    return { datePreset: null, dateRange: undefined };
  }

  /**
   * Filters transactions based on state criteria.
   * @param state - Filter state containing date, amount, categories, banks, and transactions.
   * @returns Filtered array of transactions.
   */
  static getFilteredTransactions(state: FilterState): Transaction[] {
    return state.transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      if (isNaN(txDate.getTime())) return false;

      let ok = true;

      if (state.dateRange) {
        const from = new Date(state.dateRange.from);
        from.setHours(0, 0, 0, 0);
        const to = new Date(state.dateRange.to);
        to.setHours(23, 59, 59, 999);
        ok = ok && txDate >= from && txDate <= to;
      }

      const amt = parseFloat(String(tx.amount).replace(/[^0-9.-]+/g, ''));
      ok = ok && amt >= state.amountRange[0] && amt <= state.amountRange[1];

      if (state.selectedCategories.length > 0) {
        ok = ok && state.selectedCategories.some((cat) => tx.category.name === cat.name);
      }

      if (state.selectedBanks.length > 0) {
        ok = ok && state.selectedBanks.some((bank) => tx.recipientBankId === bank.cardId);
      }

      return ok;
    });
  }

  /**
   * Filters banks based on search term.
   * @param banks - Array of banks to filter.
   * @param searchTerm - Search term for filtering.
   * @returns Filtered array of banks.
   */
  static getFilteredBanks(banks: Bank[], searchTerm: string): Bank[] {
    return searchTerm
      ? banks.filter((bank) => bank.cardholderName.toLowerCase().includes(searchTerm.toLowerCase()))
      : banks;
  }

  /**
   * Filters categories based on search term.
   * @param categories - Array of categories to filter.
   * @param searchTerm - Search term for filtering.
   * @returns Filtered array of categories.
   */
  static getFilteredCategories(categories: CategoryWithBank[], searchTerm: string): CategoryWithBank[] {
    return searchTerm
      ? categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : categories;
  }

  /**
   * Checks if the filter state differs from the initial state.
   * @param state - Current filter state.
   * @param initialState - Initial filter state.
   * @returns True if any filter criteria differ.
   */
  static isFiltered(state: FilterState, initialState: FilterState): boolean {
    return (
      state.datePreset !== initialState.datePreset ||
      state.dateRange !== initialState.dateRange ||
      state.amountRange[0] !== initialState.amountRange[0] ||
      state.amountRange[1] !== initialState.amountRange[1] ||
      state.selectedCategories.length !== initialState.selectedCategories.length ||
      state.selectedBanks.length !== initialState.selectedBanks.length
    );
  }
}

export const transactionFilterService = TransactionFilterService;
