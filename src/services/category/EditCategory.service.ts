import { Dispatch } from '@reduxjs/toolkit';
import { MENU_STATUSES, MenuStatus } from 'constants/menuStatuses';
import { setBanks } from 'state/main/bankSlice';
import { Category } from 'types/Category.interface';
import { Updater } from 'use-immer';
import { Bank } from 'types/Bank.interface';
/**
 * Service for managing category-related actions in the application.
 */
class CategoryService {
  /**
   * Resets the category selection and status to their default states.
   * @param setEditedCategories - Immer updater for setting edited categories.
   * @param setStatus - React state setter for menu status.
   */
  private resetSelection(
    setEditedCategories: Updater<Category[]>,
    setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>
  ) {
    setStatus(MENU_STATUSES.DEFAULT);
    setEditedCategories([]);
  }

  /**
   * Handles the cancel action by resetting categories and status.
   * @param setStatus - React state setter for menu status.
   * @param setEditedCategories - Immer updater for setting edited categories.
   */
  handleCancel(
    setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>,
    setEditedCategories: Updater<Category[]>
  ) {
    this.resetSelection(setEditedCategories, setStatus);
  }

  /**
   * Handles the submit action by updating banks with new category data.
   * @param banks - Array of bank objects containing category data.
   * @param activeTab - Index of the active bank tab.
   * @param dispatch - Redux dispatch function for state updates.
   * @param setStatus - React state setter for menu status.
   * @param data - Array of updated categories.
   */
  handleSubmit(
    banks: Bank[],
    activeTab: number,
    dispatch: Dispatch,
    setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>,
    data: Category[]
  ) {
    const updatedBanks = banks.map((bank, index) =>
      index === activeTab ? { ...bank, categories: data } : bank
    );
    dispatch(setBanks(updatedBanks));
    setStatus(MENU_STATUSES.DEFAULT);
  }
}

export const editCategoryService = new CategoryService();
