"use client";

import { autoUpdate, offset, shift, useFloating } from "@floating-ui/react";
import { useClickOutside } from "@react-hookz/web";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { transactionFilterService } from "services/Transactions.service";
import { Bank } from "types/Bank.interface";
import { Category } from "types/Category.interface";
import { Transaction } from "types/Transaction.interface";
import { FilterPanel } from "./FilterPanel";
import { AmountFilter } from "./filters/Amount.filter";
import { BankFilter } from "./filters/Bank.filter";
import { CategoryFilter } from "./filters/Category.filter";
import { DateFilter } from "./filters/Date.filter";

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

interface FiltersMenuProps {
  categories: CategoryWithBank[];
  banks: Bank[];
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: Dispatch<SetStateAction<boolean>>;
}

export function FiltersMenu({
  categories,
  banks,
  transactions,
  setTransactions,
  setIsCalendarOpen,
  isCalendarOpen,
}: FiltersMenuProps) {
  const initialState: FilterState = {
    datePreset: null,
    dateRange: undefined,
    amountRange: [0, 100000],
    selectedCategories: [],
    selectedBanks: [],
    transactions,
  };

  const [state, setState] = useState<FilterState>({
    ...initialState,
    transactions,
  });
  const [openedSection, setOpenedSection] = useState<
    "date" | "category" | "bank" | "amount" | undefined
  >();
  const menuRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // // Floating UI for menu positioning
  // const { refs: menuRefs, floatingStyles: menuStyles } = useFloating({
  //   placement: "bottom-end",
  //   middleware: [
  //     offset({ mainAxis: 8 }), // Equivalent to mt-2
  //     shift({ padding: 40 }), // Ensure it stays within viewport with padding
  //   ],
  //   whileElementsMounted: autoUpdate,
  //   elements: { reference: referenceElement },
  // });

  // Floating UI for calendar positioning
  const { refs: calendarRefs, floatingStyles: calendarStyles } = useFloating({
    placement: "left-start",
    middleware: [
      offset({ mainAxis: 12, crossAxis: 3 }), // Equivalent to -translate-x-[calc(100%+12px)] and top-3
      shift({ padding: 40 }),
    ],
    whileElementsMounted: autoUpdate,
    elements: { reference: menuRef.current },
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, transactions }));
  }, [transactions]);

  useEffect(() => {
    if (menuRef.current) {
      const coords = menuRef.current.getBoundingClientRect();
      menuRef.current.style.maxHeight = `${window.innerHeight - coords.top - 40}px`;
    }
  }, []);

  useClickOutside(calendarRef, () => setIsCalendarOpen(false));
  useEffect(() => {
    if (openedSection !== "date") setIsCalendarOpen(false);
  }, [openedSection]);

  const setDateRange = (range: { from: Date; to: Date } | undefined) => {
    setState((prev) => ({
      ...prev,
      dateRange: range,
      datePreset: range ? null : prev.datePreset,
    }));
  };

  const setAmountRange = (range: [number, number]) => {
    setState((prev) => ({ ...prev, amountRange: range }));
  };

  const toggleCategory = (category: CategoryWithBank) => {
    setState((prev) => {
      const isSelected = prev.selectedCategories.some(
        (cat) => cat.name === category.name,
      );
      return {
        ...prev,
        selectedCategories: isSelected
          ? prev.selectedCategories.filter((cat) => cat.name !== category.name)
          : [...prev.selectedCategories, category],
      };
    });
  };

  const removeCategory = (category: CategoryWithBank) => {
    setState((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.filter(
        (cat) => cat.name !== category.name,
      ),
    }));
  };

  const toggleBank = (bank: Bank) => {
    setState((prev) => {
      const isSelected = prev.selectedBanks.some(
        (b) => b.cardId === bank.cardId,
      );
      return {
        ...prev,
        selectedBanks: isSelected
          ? prev.selectedBanks.filter((b) => b.cardId !== bank.cardId)
          : [...prev.selectedBanks, bank],
      };
    });
  };

  const removeBank = (bank: Bank) => {
    setState((prev) => ({
      ...prev,
      selectedBanks: prev.selectedBanks.filter((b) => b.cardId !== bank.cardId),
    }));
  };

  const resetFilters = () => {
    setState((prev) => ({ ...initialState, transactions: prev.transactions }));
  };

  const filteredTransactions =
    transactionFilterService.getFilteredTransactions(state);
  useEffect(() => {
    setTransactions(filteredTransactions);
  }, [filteredTransactions, setTransactions]);

  return (
    <div
      // ref={menuRefs.setFloating}
      // style={menuStyles}
      className={clsx(
        "menu absolute top-[calc(100%+10px)] left-full z-20 w-90 -translate-x-full overflow-visible rounded-lg bg-white shadow-md",
      )}
    >
      <div ref={menuRef} className="flex flex-col gap-y-1 overflow-y-auto p-4">
        {transactionFilterService.isFiltered(state, initialState) ? (
          <div className="border-border flex w-full items-center justify-between border-b">
            <span className="text-dark pb-1 text-lg font-semibold">
              Applied Filters
            </span>
            <span
              className="text-light-blue cursor-pointer text-sm font-medium"
              onClick={resetFilters}
            >
              Reset
            </span>
          </div>
        ) : (
          <span className="text-dark text-lg font-semibold">Filters</span>
        )}
        <FilterPanel
          datePreset={state.datePreset}
          dateRange={state.dateRange}
          amountRange={state.amountRange}
          selectedCategories={state.selectedCategories}
          selectedBanks={state.selectedBanks}
          setDatePreset={(preset) => {
            const { datePreset, dateRange } =
              transactionFilterService.setDatePreset(preset);
            setState((prev) => ({ ...prev, datePreset, dateRange }));
          }}
          setDateRange={setDateRange}
          setAmountRange={setAmountRange}
          removeCategory={removeCategory}
          removeBank={removeBank}
        />
        <DateFilter
          isOpen={openedSection === "date"}
          setIsOpen={() =>
            setOpenedSection(openedSection === "date" ? undefined : "date")
          }
          datePreset={state.datePreset}
          dateRange={state.dateRange}
          setDatePreset={(preset) => {
            const { datePreset, dateRange } =
              transactionFilterService.setDatePreset(preset);
            setState((prev) => ({ ...prev, datePreset, dateRange }));
          }}
          setDateRange={setDateRange}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          calendarRef={calendarRef}
          setRef={calendarRefs.setFloating}
          styles={calendarStyles}
        />
        <CategoryFilter
          isOpen={openedSection === "category"}
          setIsOpen={() =>
            setOpenedSection(
              openedSection === "category" ? undefined : "category",
            )
          }
          categories={categories}
          selectedCategories={state.selectedCategories}
          toggleCategory={toggleCategory}
        />
        <BankFilter
          isOpen={openedSection === "bank"}
          setIsOpen={() =>
            setOpenedSection(openedSection === "bank" ? undefined : "bank")
          }
          banks={banks}
          selectedBanks={state.selectedBanks}
          toggleBank={toggleBank}
        />
        <AmountFilter
          isOpen={openedSection === "amount"}
          setIsOpen={() =>
            setOpenedSection(openedSection === "amount" ? undefined : "amount")
          }
          amountRange={state.amountRange}
          setAmountRange={setAmountRange}
        />
      </div>
    </div>
  );
}
