"use client";

import { useMemo } from "react";
import { Category } from "types/Category.interface";
import { Bank } from "types/Bank.interface";
import { FilterChip } from "./FilterItem";
import { AnimatePresence } from "framer-motion";

interface CategoryWithBank extends Category {
  bank: { cardId: string; cardholderName: string };
}

interface FilterPanelProps {
  datePreset: "today" | "last7" | "last30Days" | null;
  dateRange: { from: Date; to: Date } | undefined;
  amountRange: [number, number];
  selectedCategories: CategoryWithBank[];
  selectedBanks: Bank[];
  setDatePreset: (preset: "today" | "last7" | "last30Days" | null) => void;
  setDateRange: (range: { from: Date; to: Date } | undefined) => void;
  setAmountRange: (range: [number, number]) => void;
  removeCategory: (category: CategoryWithBank) => void;
  removeBank: (bank: Bank) => void;
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
  const chips = useMemo(() => {
    const result: JSX.Element[] = [];

    if (datePreset) {
      result.push(
        <FilterChip
          key="datePreset"
          label="Date"
          value={
            datePreset === "today"
              ? "Today"
              : datePreset === "last7"
                ? "Last 7 Days"
                : "Last 30 Days"
          }
          onRemove={() => setDatePreset(null)}
        />,
      );
    } else if (dateRange?.from && dateRange?.to) {
      result.push(
        <FilterChip
          key="dateRange"
          label="Date"
          value={`${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`}
          onRemove={() => setDateRange(undefined)}
        />,
      );
    }

    if (amountRange[0] !== 0 || amountRange[1] !== 100000) {
      result.push(
        <FilterChip
          key="amount"
          label="Amount"
          value={`$${amountRange[0]} - $${amountRange[1]}`}
          onRemove={() => setAmountRange([0, 100000])}
        />,
      );
    }

    selectedCategories.forEach((cat) => {
      result.push(
        <FilterChip
          key={`category-${cat.name}`}
          label="Category"
          value={cat.name}
          onRemove={() => removeCategory(cat)}
        />,
      );
    });

    selectedBanks.forEach((bank) => {
      result.push(
        <FilterChip
          key={`bank-${bank.cardId}`}
          label="Bank"
          value={bank.cardholderName}
          onRemove={() => removeBank(bank)}
        />,
      );
    });

    return result;
  }, [datePreset, dateRange, amountRange, selectedCategories, selectedBanks]);

  return chips.length > 0 ? (
    <div className="my-2 flex flex-wrap gap-x-2 gap-y-3">
      <AnimatePresence>{chips}</AnimatePresence>
    </div>
  ) : null;
}
