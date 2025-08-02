'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { transactionFilterService } from 'services/Transactions.service';
import { Bank } from 'types/Bank.interface';
import { CategoryWithBank } from 'types/Category.interface';
import { Transaction } from 'types/Transaction.interface';

/**
 * Interface for the filter state.
 */
interface FilterState {
  datePreset: 'today' | 'last7' | 'last30Days' | null;
  dateRange: { from: Date; to: Date } | undefined;
  amountRange: [number, number];
  selectedCategories: CategoryWithBank[];
  selectedBanks: Bank[];
  transactions: Transaction[];
}

/**
 * Props for the useFiltersMenuState hook.
 */
interface FiltersMenuStateProps {
  categories: CategoryWithBank[];
  banks: Bank[];
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

/**
 * Hook for managing the state and logic of the FiltersMenu component.
 * @param props - Props containing categories, banks, transactions, and setTransactions.
 * @returns Object containing state, opened section, and event handlers.
 */
export const useFiltersMenuState = ({
  categories,
  banks,
  transactions,
  setTransactions,
}: FiltersMenuStateProps) => {
  const initialState: FilterState = {
    datePreset: null,
    dateRange: undefined,
    amountRange: [0, 100000],
    selectedCategories: [],
    selectedBanks: [],
    transactions,
  };

  const [state, setState] = useState<FilterState>({ ...initialState, transactions });
  const [openedSection, setOpenedSection] = useState<'date' | 'category' | 'bank' | 'amount' | undefined>();

  useEffect(() => {
    setState((prev) => ({ ...prev, transactions }));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactionFilterService.getFilteredTransactions(state);
  }, [state]);

  useEffect(() => {
    setTransactions(filteredTransactions);
  }, [filteredTransactions, setTransactions]);

  /**
   * Sets the date range and clears date preset if range is provided.
   * @param range - Date range or undefined.
   */
  const setDateRange = (range: { from: Date; to: Date } | undefined) => {
    setState((prev) => ({
      ...prev,
      dateRange: range,
      datePreset: range ? null : prev.datePreset,
    }));
  };

  /**
   * Sets the amount range filter.
   * @param range - Amount range [min, max].
   */
  const setAmountRange = (range: [number, number]) => {
    setState((prev) => ({ ...prev, amountRange: range }));
  };

  /**
   * Toggles a category filter.
   * @param category - Category to toggle.
   */
  const toggleCategory = (category: CategoryWithBank) => {
    setState((prev) => {
      const isSelected = prev.selectedCategories.some((cat) => cat.name === category.name);
      return {
        ...prev,
        selectedCategories: isSelected
          ? prev.selectedCategories.filter((cat) => cat.name !== category.name)
          : [...prev.selectedCategories, category],
      };
    });
  };

  /**
   * Removes a category filter.
   * @param category - Category to remove.
   */
  const removeCategory = (category: CategoryWithBank) => {
    setState((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.filter((cat) => cat.name !== category.name),
    }));
  };

  /**
   * Toggles a bank filter.
   * @param bank - Bank to toggle.
   */
  const toggleBank = (bank: Bank) => {
    setState((prev) => {
      const isSelected = prev.selectedBanks.some((b) => b.cardId === bank.cardId);
      return {
        ...prev,
        selectedBanks: isSelected
          ? prev.selectedBanks.filter((b) => b.cardId !== bank.cardId)
          : [...prev.selectedBanks, bank],
      };
    });
  };

  /**
   * Removes a bank filter.
   * @param bank - Bank to remove.
   */
  const removeBank = (bank: Bank) => {
    setState((prev) => ({
      ...prev,
      selectedBanks: prev.selectedBanks.filter((b) => b.cardId !== bank.cardId),
    }));
  };

  /**
   * Resets all filters to their initial state.
   */
  const resetFilters = () => {
    setState((prev) => ({ ...initialState, transactions: prev.transactions }));
  };

  /**
   * Sets the date preset and updates date range accordingly.
   * @param preset - Date preset ('today', 'last7', 'last30Days') or null.
   */
  const handleSetDatePreset = (preset: 'today' | 'last7' | 'last30Days' | null) => {
    const { datePreset, dateRange } = transactionFilterService.setDatePreset(preset);
    setState((prev) => ({ ...prev, datePreset, dateRange }));
  };

  return {
    state,
    openedSection,
    setOpenedSection,
    setDateRange,
    setAmountRange,
    toggleCategory,
    removeCategory,
    toggleBank,
    removeBank,
    resetFilters,
    handleSetDatePreset,
  };
};
