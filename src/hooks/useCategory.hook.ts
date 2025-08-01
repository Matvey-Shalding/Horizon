import { useMemo } from 'react';
import { hexToRgba } from 'utils/hexToRgba';
import { Bank } from 'types/Bank.interface';
import { Category } from 'types/Category.interface';

/**
 * Computes category-related data for display.
 * @param category - Category details.
 * @param currentBank - Current bank details.
 * @returns Object with computed expenses, progress, and colors.
 */
export function useCategory(category: Category, currentBank: Bank) {
  const { expenses, color, name } = category;

  const currentExpenses = useMemo(() => parseInt(expenses, 10), [expenses]);
  const monthlyBudget = Number(currentBank.monthlyBudget);
  const bankExpenses = Number(currentBank.expenses ?? 0);

  const amountLeft = useMemo(() => monthlyBudget - bankExpenses, [monthlyBudget, bankExpenses]);
  const progress = useMemo(() => (currentExpenses / monthlyBudget) * 100, [monthlyBudget, currentExpenses]);

  const bgColor = useMemo(() => hexToRgba(color, 0.2), [color]);
  const progressColor = useMemo(() => hexToRgba(color, 0.55), [color]);
  const labelColor = useMemo(() => hexToRgba(color, 0.9), [color]);

  return {
    currentExpenses,
    amountLeft,
    progress,
    bgColor,
    progressColor,
    labelColor,
    name,
    color,
  };
}
