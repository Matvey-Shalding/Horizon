// services/addCategoryService.ts
import { DEFAULT_COLOR } from 'constants/DefaultColor';
import { UseFormReset, UseFormSetError } from 'react-hook-form';
import { bankCategorySchemaType } from 'schemas/bankCategory.schema';
import { Category } from 'types/Category.interface';
import { Updater } from 'use-immer';

class AddCategoryService {
  

  closeForm(
    clearErrors: () => void,
    setShowColorPicker: (value: boolean) => void,
    setOpen: (value: boolean) => void,
    reset: UseFormReset<bankCategorySchemaType>,
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>,
    onCancel?: () => void
  ) {
    setSelectedColor(DEFAULT_COLOR);
    clearErrors();
    setShowColorPicker(false);
    reset();
    setOpen(false);
    onCancel?.()
  }

  submitCategory(
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
    const duplicate = categories.some(
      (category) => category.name.trim().toLowerCase() === data.name.trim().toLowerCase()
    );

    if (duplicate) {
      setError('root', {
        type: 'manual',
        message: 'Category names must be unique.',
      });
      return;
    }

    setCategories((draft) => {
      draft.push({ ...data, expenses: '0' });
    });
    this.closeForm(clearErrors, setShowColorPicker, setOpen, reset, setSelectedColor);
  }
}

export const addCategoryService = new AddCategoryService();
