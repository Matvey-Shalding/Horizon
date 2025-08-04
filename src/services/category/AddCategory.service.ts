'use client';

import { DEFAULT_COLOR } from 'constants/defaultColor';
import { UseFormReset, UseFormSetError } from 'react-hook-form';
import { BankCategorySchemaType } from 'schemas/bankCategory.schema';
import { Category } from 'types/Category.interface';
import { Updater } from 'use-immer';
interface CloseFormOptions {

  clearErrors: () => void;

  setShowColorPicker: (value: boolean) => void;

  setOpen: (value: boolean) => void;

  reset: UseFormReset<BankCategorySchemaType>;

  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;

  onCancel?: () => void;
}

/**
 * Options for the submitCategory function
 */
interface SubmitCategoryOptions extends CloseFormOptions {
  data: BankCategorySchemaType;
  categories: Category[];
  setError: UseFormSetError<BankCategorySchemaType>;
  setCategories: Updater<Category[]>;
}

/**
 * Closes the category form and resets its state
 * @param options - Configuration for closing the form
 */
const closeForm = ({
  clearErrors,
  setShowColorPicker,
  setOpen,
  reset,
  setSelectedColor,
  onCancel,
}: CloseFormOptions) => {
  setSelectedColor(DEFAULT_COLOR);
  clearErrors();
  setShowColorPicker(false);
  reset();
  setOpen(false);
  onCancel?.();
};

/**
 * Submits a new category and handles validation
 * @param options - Configuration for submitting the category
 * @returns void
 */
const submitCategory = ({
  data,
  categories,
  setError,
  setCategories,
  ...closeFormOptions
}: SubmitCategoryOptions) => {
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
  closeForm(closeFormOptions);
};

/**
 * Service object for category-related operations
 */
export const addCategoryService = {
  closeForm,
  submitCategory,
};
