import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useImmer } from 'use-immer';
import { setBanks } from 'state/main/bankSlice';
import { RootState } from 'state/store';
import { Category } from 'types/Category.interface';
import { MenuStatus } from 'constants/menuStatuses';

/**
 * Props for the useCategorySectionState hook.
 */
interface CategorySectionStateProps {
  status: MenuStatus;
  setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>;
  activeTab: number;
}

/**
 * Hook for managing state and memoized values in the CategorySection component.
 * @param props - Props for menu status, status setter, and active tab.
 * @returns Object containing state, memoized values, and dispatch for the CategorySection component.
 */
export const useCategorySectionState = ({ status, setStatus, activeTab }: CategorySectionStateProps) => {
  const dispatch = useDispatch();
  const banks = useSelector((state: RootState) => state.bank.banks);

  // Derive the categories for the active tab
  const categories = useMemo(() => banks[activeTab]?.categories || [], [banks, activeTab]);

  // Common state used by various modes
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deletedCategories, setDeletedCategories] = useImmer<string[]>([]);
  const [myCategories, setMyCategories] = useImmer<Category[]>([...categories]);

  // Current bank for the active tab
  const currentBank = useMemo(() => banks[activeTab] || { categories: [] }, [banks, activeTab]);

  // Common props for subcomponents
  const commonProps = useMemo(
    () => ({
      status,
      setStatus,
      categories,
      open,
      setOpen,
      banks,
      activeTab,
      dispatch,
    }),
    [status, setStatus, open, setOpen, banks, activeTab, dispatch]
  );

  // Update banks when myCategories changes
  useEffect(() => {
    const updatedBanks = banks.map((bank, index) =>
      index === activeTab ? { ...bank, categories: myCategories } : bank
    );
    dispatch(setBanks(updatedBanks));
  }, [myCategories, banks, activeTab, dispatch]);

  return {
    banks,
    categories,
    open,
    setOpen,
    menuOpen,
    setMenuOpen,
    deletedCategories,
    setDeletedCategories,
    myCategories,
    setMyCategories,
    currentBank,
    commonProps,
  };
};
