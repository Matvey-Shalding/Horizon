'use client';

import clsx from 'clsx';
import { Dispatch, memo, SetStateAction } from 'react';
import { Bank } from 'types/Bank.interface';
import { CategoryWithBank } from 'types/Category.interface';
import { Transaction } from 'types/Transaction.interface';
import { FilterPanel } from './FilterPanel';
import { AmountFilter } from './filters/Amount.filter';
import { BankFilter } from './filters/Bank.filter';
import { CategoryFilter } from './filters/Category.filter';
import { DateFilter } from './filters/Date.filter';
import { useFiltersMenuState } from 'hooks/useFiltersMenuState.hook';

interface FiltersMenuProps {
  categories: CategoryWithBank[];
  banks: Bank[];
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: Dispatch<SetStateAction<boolean>>;
}

function Filters({
  categories,
  banks,
  transactions,
  setTransactions,
  setIsCalendarOpen,
  isCalendarOpen,
}: FiltersMenuProps) {
  const {
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
  } = useFiltersMenuState({ categories, banks, transactions, setTransactions });

  return (
    <div
      className={clsx(
        'menu absolute top-[calc(100%+10px)] right-0 z-20 w-70 overflow-x-hidden',
        'overflow-y-auto rounded-lg bg-white p-4 pb-6 shadow-md'
      )}
    >
      <div className="flex h-full w-full flex-col gap-y-1">
        {state.datePreset ||
        state.dateRange ||
        state.amountRange[0] !== 0 ||
        state.amountRange[1] !== 100000 ||
        state.selectedCategories.length > 0 ||
        state.selectedBanks.length > 0 ? (
          <div className="border-border flex w-full items-center justify-between border-b">
            <span className="text-dark pb-1 text-lg font-semibold">Applied Filters</span>
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
          setDatePreset={handleSetDatePreset}
          setDateRange={setDateRange}
          setAmountRange={setAmountRange}
          removeCategory={removeCategory}
          removeBank={removeBank}
        />
        <DateFilter
          isOpen={openedSection === 'date'}
          setIsOpen={() => setOpenedSection(openedSection === 'date' ? undefined : 'date')}
          datePreset={state.datePreset}
          dateRange={state.dateRange}
          setDatePreset={handleSetDatePreset}
          setDateRange={setDateRange}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
        />
        <CategoryFilter
          isOpen={openedSection === 'category'}
          setIsOpen={() => setOpenedSection(openedSection === 'category' ? undefined : 'category')}
          categories={categories}
          selectedCategories={state.selectedCategories}
          toggleCategory={toggleCategory}
        />
        <BankFilter
          isOpen={openedSection === 'bank'}
          setIsOpen={() => setOpenedSection(openedSection === 'bank' ? undefined : 'bank')}
          banks={banks}
          selectedBanks={state.selectedBanks}
          toggleBank={toggleBank}
        />
        <AmountFilter
          isOpen={openedSection === 'amount'}
          setIsOpen={() => setOpenedSection(openedSection === 'amount' ? undefined : 'amount')}
          amountRange={state.amountRange}
          setAmountRange={setAmountRange}
        />
      </div>
    </div>
  );
}

export const FiltersMenu = memo(Filters)
