'use client';

import { DEFAULT_COLOR } from 'constants/defaultColor';
import { UseFormReset, UseFormSetError } from 'react-hook-form';
import { BankCategorySchemaType } from 'schemas/bankCategory.schema';
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
    reset: UseFormReset<BankCategorySchemaType>,
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
    data: BankCategorySchemaType,
    categories: Category[],
    setError: UseFormSetError<BankCategorySchemaType>,
    clearErrors: () => void,
    setShowColorPicker: (value: boolean) => void,
    setOpen: (value: boolean) => void,
    setCategories: Updater<Category[]>,
    reset: UseFormReset<BankCategorySchemaType>,
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
      draft.push({ ...data, expenses: '0' });
    });
    this.closeCategoryMenu(clearErrors, setShowColorPicker, setOpen, reset, setSelectedColor);
  }
}

/** Singleton instance of ConnectBank service */
export const connectBankService = new ConnectBank();
