'use client';

import { AnimatePresence } from 'framer-motion';
import { useFilterPanelState } from 'hooks/useFilterPanel.hook';
import { Bank } from 'types/Bank.interface';
import { CategoryWithBank } from 'types/Category.interface';

interface FilterPanelProps {
  datePreset: 'today' | 'last7' | 'last30Days' | null;
  amountRange: [number, number];
  selectedCategories: CategoryWithBank[];
  selectedBanks: Bank[];
  setDatePreset: (preset: 'today' | 'last7' | 'last30Days' | null) => void;
  setDateRange: (range: { from: Date; to: Date } | undefined) => void;
  setAmountRange: (range: [number, number]) => void;
  removeCategory: (category: CategoryWithBank) => void;
  removeBank: (bank: Bank) => void;
  dateRange: { from: Date; to: Date } | undefined;
}

export function FilterPanel({
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
}: FilterPanelProps) {
  const { chips } = useFilterPanelState({
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
  });

  return chips.length > 0 ? (
    <div className="my-2 flex flex-wrap gap-x-2 gap-y-3">
      <AnimatePresence>{chips}</AnimatePresence>
    </div>
  ) : null;
}
1;
