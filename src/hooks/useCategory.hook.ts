import { useMemo } from 'react';
import { hexToRgba } from 'utils/hexToRgba';
import { Bank } from 'types/Bank.interface';
import { Category } from 'types/Category.interface';

export function useCategory(category: Category, currentBank: Bank) {
  const { expenses, color, name } = category;

  const currentExpenses = useMemo(() => parseInt(expenses, 10), [expenses]);

  const amountLeft = useMemo(
    () => Number(currentBank.monthlyBudget) - Number(currentBank.expenses ?? 0),
    [currentBank]
  );

  const progress = useMemo(() => {
    return (Number(currentExpenses) / Number(currentBank.monthlyBudget)) * 100;
  }, [currentBank, currentExpenses]);

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
