'use client';

import { Dispatch } from '@reduxjs/toolkit';
import { DEFAULT_COLOR } from 'constants/DefaultColor';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { UseFormReset, UseFormSetError } from 'react-hook-form';
import { MAIN_ROUTES } from 'routes';
import { bankCategorySchemaType } from 'schemas/bankCategory.schema';
import { ConnectBankSchemaType } from 'schemas/connectBank.schema';
import { addBank } from 'state/main/bankSlice';
import { Category } from 'types/Category.interface';
import { Updater } from 'use-immer';

/**
 * Service class for managing bank connection and category addition
 */
class ConnectBank {
  /**
   * Closes the category menu and resets form state
   * @param clearErrors - Clears form errors
   * @param setShowColorPicker - Toggles color picker visibility
   * @param setIsCategoryFormOpen - Toggles category form visibility
   * @param reset - Resets the category form
   * @param setSelectedColor - Sets the selected color
   */
  closeCategoryMenu(
    clearErrors: () => void,
    setShowColorPicker: (value: boolean) => void,
    setIsCategoryFormOpen: (value: boolean) => void,
    reset: UseFormReset<bankCategorySchemaType>,
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>
  ) {
    setSelectedColor(DEFAULT_COLOR);
    clearErrors();
    setShowColorPicker(false);
    reset();
    setIsCategoryFormOpen(false);
  }

  /**
   * Adds a new category if unique, then closes the menu
   * @param data - Category form data
   * @param categories - Current array of categories
   * @param setError - Sets form errors
   * @param clearErrors - Clears form errors
   * @param setShowColorPicker - Toggles color picker visibility
   * @param setOpen - Toggles category form visibility
   * @param setCategories - Updates categories array
   * @param reset - Resets the category form
   * @param setSelectedColor - Sets the selected color
   */
  addCategory(
    data: bankCategorySchemaType,
    categories: Category[],
    setError: UseFormSetError<bankCategorySchemaType>,
    clearErrors: () => void,
    setShowColorPicker: (value: boolean) => void,
    setOpen: (value: boolean) => void,
    setCategories: Updater<Category[]>,
    reset: UseFormReset<bankCategorySchemaType>,
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>
  ) {
    const isDuplicate = categories.some(
      (category) => category.name.trim().toLowerCase() === data.name.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError('root', {
        type: 'manual',
        message: 'Category names must be unique.',
      });
      return;
    }

    setCategories((draft) => {
      draft.push({...data,expenses: "0"});
    });
    this.closeCategoryMenu(clearErrors, setShowColorPicker, setOpen, reset, setSelectedColor);
  }

  /**
   * Connects a new bank, dispatches it, and navigates to home
   * @param data - Bank connection form data
   * @param setError - Sets form errors
   * @param reset - Resets the bank connection form
   * @param setCategories - Updates categories array
   * @param dispatch - Redux dispatch function
   * @param router - Next.js router instance
   */
  connect(
    data: ConnectBankSchemaType,
    setError: UseFormSetError<ConnectBankSchemaType>,
    reset: UseFormReset<ConnectBankSchemaType>,
    setCategories: Updater<Category[]>,
    dispatch: Dispatch,
    router: AppRouterInstance
  ) {
    reset();
    setCategories(() => []);
    const categories:Category[] = data.categories.map(cat => ({...cat,expenses: "0"}))
    dispatch(addBank({ ...data, transactions: [], expenses: '0',categories }));
    router.push(MAIN_ROUTES.HOME);
  }
}

/** Singleton instance of ConnectBank service */
export const connectBankService = new ConnectBank();
