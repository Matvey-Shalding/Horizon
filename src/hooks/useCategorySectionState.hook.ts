import { MenuStatus } from '@/constants/menuStatuses';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBanks } from 'state/main/bankSlice';
import { RootState } from 'state/store';
import { Category } from 'types/Category.interface';
import { useImmer } from 'use-immer';

interface CategorySectionStateProps {
  status: MenuStatus;
  setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>;
  activeTab: number;
}

export const useCategorySectionState = ({ status, setStatus, activeTab }: CategorySectionStateProps) => {
  const dispatch = useDispatch();
  const banks = useSelector((state: RootState) => state.bank.banks);

  const categories = useMemo(() => banks[activeTab]?.categories || [], [banks, activeTab]);

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deletedCategories, setDeletedCategories] = useImmer<string[]>([]);
  const [myCategories, setMyCategories] = useImmer<Category[]>([...categories]);

  const currentBank = useMemo(() => banks[activeTab] || { categories: [] }, [banks, activeTab]);

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
    [status, setStatus, open, setOpen, banks, activeTab, dispatch, categories]
  );

  useEffect(() => {
    const updatedBanks = banks.map((bank, index) =>
      index === activeTab ? { ...bank, categories: myCategories } : bank
    );
    dispatch(setBanks(updatedBanks));
  }, [myCategories, activeTab, dispatch]); // Removed banks from dependencies

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
