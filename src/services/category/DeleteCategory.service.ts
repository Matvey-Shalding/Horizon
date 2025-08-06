'use client';

import { Dispatch } from '@reduxjs/toolkit';
import { MenuStatus } from 'constants/menuStatuses';
import { ChangeEvent } from 'react';
import { authorizationService } from 'services/Authorization.service';
import { setBanks } from 'state/main/bankSlice';
import { SingUp } from 'types/Auth.types';
import { Bank } from 'types/Bank.interface';
import { Category } from 'types/Category.interface';
import { Updater } from 'use-immer';

/**
 * Service class for managing category selection and deletion
 */
class CategoryService {
  /**
   * Resets category selection state
   * @param setDeletedCategories - Updater for the deleted categories array
   * @param setCheckAll - Setter for the check all state
   */
  resetSelection(
    setDeletedCategories: Updater<string[]>,
    setCheckAll: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setDeletedCategories([]);
    setCheckAll(false);
  }

  /**
   * Handles the "check all" checkbox toggle
   * @param e - Checkbox change event
   * @param categories - Array of categories
   * @param setCheckAll - Setter for the check all state
   * @param setDeletedCategories - Updater for the deleted categories array
   */
  handleCheckAll(
    e: ChangeEvent<HTMLInputElement>,
    categories: Category[],
    setCheckAll: React.Dispatch<React.SetStateAction<boolean>>,
    setDeletedCategories: Updater<string[]>
  ) {
    const isChecked = e.target.checked;
    setCheckAll(isChecked);
    setDeletedCategories(isChecked ? categories.map((c) => c.name) : []);
  }

  /**
   * Cancels category deletion and resets state
   * @param setStatus - Setter for the menu status
   * @param setDeletedCategories - Updater for the deleted categories array
   * @param setCheckAll - Setter for the check all state
   */
  handleCancel(
    setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>,
    setDeletedCategories: Updater<string[]>,
    setCheckAll: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setStatus('DEFAULT');
    this.resetSelection(setDeletedCategories, setCheckAll);
  }

  /**
   * Deletes selected categories from the active bank tab
   * @param banks - Array of banks
   * @param activeTab - Index of the active bank tab
   * @param categories - Array of categories
   * @param deletedCategories - Array of category names to delete
   * @param dispatch - Redux dispatch function
   * @param setStatus - Setter for the menu status
   * @param setDeletedCategories - Updater for the deleted categories array
   * @param setCheckAll - Setter for the check all state
   */
  handleDelete(
    banks: Bank[],
    activeTab: number,
    categories: Category[],
    deletedCategories: string[],
    dispatch: Dispatch,
    setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>,
    setDeletedCategories: Updater<string[]>,
    setCheckAll: React.Dispatch<React.SetStateAction<boolean>>,
    user: SingUp | null | undefined
  ) {
    const updatedBanks = [...banks];
    updatedBanks[activeTab] = {
      ...updatedBanks[activeTab],
      categories: categories.filter((c) => !deletedCategories.includes(c.name)),
    };
    dispatch(setBanks(updatedBanks));
    setStatus('DEFAULT');
    this.resetSelection(setDeletedCategories, setCheckAll);
    authorizationService.handleSaveData(user, updatedBanks);
  }
}

/** Singleton instance of CategoryService */
export const deleteCategoryService = new CategoryService();
