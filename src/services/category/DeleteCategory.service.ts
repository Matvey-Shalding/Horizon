import { Dispatch } from '@reduxjs/toolkit';
import { MenuStatus } from 'constants/MenuStatuses';
import { ChangeEvent } from 'react';
import { setBanks } from 'state/main/bankSlice';
import { Updater } from 'use-immer';

class CategoryService {
  resetSelection(
    setDeletedCategories: Updater<string[]>,
    setCheckAll: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setDeletedCategories([]);
    setCheckAll(false);
  }

  handleCheckAll(
    e: ChangeEvent<HTMLInputElement>,
    categories: any[],
    setCheckAll: React.Dispatch<React.SetStateAction<boolean>>,
    setDeletedCategories: Updater<string[]>
  ) {
    const isChecked = e.target.checked;
    setCheckAll(isChecked);
    setDeletedCategories(isChecked ? categories.map((c) => c.name) : []);
  }

  handleCancel(
    setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>,
    setDeletedCategories: Updater<string[]>,
    setCheckAll: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setStatus('DEFAULT');
    this.resetSelection(setDeletedCategories, setCheckAll);
  }

  handleDelete(
    banks: any[],
    activeTab: number,
    categories: any[],
    deletedCategories: string[],
    dispatch: Dispatch,
    setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>,
    setDeletedCategories: Updater<string[]>,
    setCheckAll: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    const updatedBanks = [...banks];
    updatedBanks[activeTab] = {
      ...updatedBanks[activeTab],
      categories: categories.filter((c) => !deletedCategories.includes(c.name)),
    };
    dispatch(setBanks(updatedBanks));
    setStatus('DEFAULT');
    this.resetSelection(setDeletedCategories, setCheckAll);
  }
}

export const deleteCategoryService = new CategoryService();
