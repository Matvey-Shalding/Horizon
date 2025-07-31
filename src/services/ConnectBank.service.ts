import { Dispatch } from '@reduxjs/toolkit';
import { DEFAULT_COLOR } from 'constants/DefaultColor';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React from 'react';
import { UseFormReset, UseFormSetError } from 'react-hook-form';
import { MAIN_ROUTES } from 'routes';
import { bankCategorySchemaType } from 'schemas/bankCategory.schema';
import { ConnectBankSchemaType } from 'schemas/connectBank.schema';
import { addBank } from 'state/main/bankSlice';
import { Category } from 'types/Category.interface';
import { Updater } from 'use-immer';

class ConnectBank {
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

  addCategory(
    data: bankCategorySchemaType,
    categories: Category[],
    setError: UseFormSetError<{
      name: string;
      budget: string;
      color: string;
    }>,
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

    setCategories((prev) => void prev.push(data));
    this.closeCategoryMenu(clearErrors, setShowColorPicker, setOpen, reset, setSelectedColor);
  }

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
    dispatch(addBank({ ...data, transactions: [], expenses: '0' }));
    router.push(MAIN_ROUTES.HOME);
  }
}
export const connectBankService = new ConnectBank();
