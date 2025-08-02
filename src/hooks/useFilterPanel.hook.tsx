import { useMemo } from 'react';
import { CategoryWithBank } from 'types/Category.interface';
import { Bank } from 'types/Bank.interface';
import { FilterChip } from 'app/main/transactions/FilterItem';
/**
 * Props for the useFilterPanelState hook.
 */
interface FilterPanelStateProps {
  /** Selected date preset (e.g., 'today', 'last7', 'last30Days') or null */
  datePreset: 'today' | 'last7' | 'last30Days' | null;
  /** Custom date range or undefined */
  dateRange: { from: Date; to: Date } | undefined;
  /** Amount range filter [min, max] */
  amountRange: [number, number];
  /** Selected categories with bank information */
  selectedCategories: CategoryWithBank[];
  /** Selected banks */
  selectedBanks: Bank[];
  /** Function to set the date preset */
  setDatePreset: (preset: 'today' | 'last7' | 'last30Days' | null) => void;
  /** Function to set the date range */
  setDateRange: (range: { from: Date; to: Date } | undefined) => void;
  /** Function to set the amount range */
  setAmountRange: (range: [number, number]) => void;
  /** Function to remove a category filter */
  removeCategory: (category: CategoryWithBank) => void;
  /** Function to remove a bank filter */
  removeBank: (bank: Bank) => void;
}

/**
 * Hook for managing the filter chips logic in the FilterPanel component.
 * @param props - Props containing filter state and setter functions.
 * @returns Object containing the computed filter chips array.
 */
export const useFilterPanelState = ({
  datePreset,
  dateRange,
  amountRange,
  selectedCategories,
  selectedBanks,
  setDatePreset,
  setDateRange,
  setAmountRange,
  removeCategory,
  removeBank,
}: FilterPanelStateProps) => {
  /**
   * Handles removing the date preset filter.
   */
  const handleRemoveDatePreset = () => {
    setDatePreset(null);
  };

  /**
   * Handles removing the date range filter.
   */
  const handleRemoveDateRange = () => {
    setDateRange(undefined);
  };

  /**
   * Handles resetting the amount range filter to default.
   */
  const handleRemoveAmountRange = () => {
    setAmountRange([0, 100000]);
  };

  const chips = useMemo(() => {
    const result: JSX.Element[] = [];

    if (datePreset) {
      result.push(
        <FilterChip
          key="datePreset"
          label="Date"
          value={datePreset === 'today' ? 'Today' : datePreset === 'last7' ? 'Last 7 Days' : 'Last 30 Days'}
          onRemove={handleRemoveDatePreset}
        />
      );
    } else if (dateRange?.from && dateRange?.to) {
      result.push(
        <FilterChip
          key="dateRange"
          label="Date"
          value={`${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`}
          onRemove={handleRemoveDateRange}
        />
      );
    }

    if (amountRange[0] !== 0 || amountRange[1] !== 100000) {
      result.push(
        <FilterChip
          key="amount"
          label="Amount"
          value={`$${amountRange[0]} - $${amountRange[1]}`}
          onRemove={handleRemoveAmountRange}
        />
      );
    }

    selectedCategories.forEach((cat) => {
      result.push(
        <FilterChip
          key={`category-${cat.name}`}
          label="Category"
          value={cat.name}
          onRemove={() => removeCategory(cat)}
        />
      );
    });

    selectedBanks.forEach((bank) => {
      result.push(
        <FilterChip
          key={`bank-${bank.cardId}`}
          label="Bank"
          value={bank.cardholderName}
          onRemove={() => removeBank(bank)}
        />
      );
    });

    return result;
  }, [datePreset, dateRange, amountRange, selectedCategories, selectedBanks, setDatePreset, setDateRange, setAmountRange, removeCategory, removeBank]);

  return { chips };
};