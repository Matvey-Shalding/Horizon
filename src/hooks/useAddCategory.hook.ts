import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_COLOR } from 'constant/defaultColor';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { bankCategorySchema, BankCategorySchemaType } from 'schemas/bankCategory.schema';
import { RootState } from 'state/store';
import { Category } from 'types/Category.interface';
import { Updater } from 'use-immer';

/**
 * Props for the useAddCategoryState hook.
 */
interface AddCategoryStateProps {
  categories: Category[];
  setCategories: Updater<Category[]>;
  defaultColor?: string;
  onCancel?: () => void;
}

/**
 * Hook for managing state and form logic in the AddCategory component.
 * @param props - Props for categories, state updater, default color, and cancel callback.
 * @returns Object containing state, form methods, and handlers for the AddCategory component.
 */
export const useAddCategoryState = ({
  categories,
  setCategories,
  defaultColor = DEFAULT_COLOR,
  onCancel,
}: AddCategoryStateProps) => {
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const banks = useSelector((state: RootState) => state.bank.banks);
  const user = useSelector((state: RootState) => state.user.user);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<BankCategorySchemaType>({
    resolver: zodResolver(bankCategorySchema),
    defaultValues: {
      name: '',
      color: defaultColor,
    },
  });

  // Handle click outside to close color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.color-picker-container')) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handles form cancellation, resetting state and invoking optional callback.
   */
  const handleCancel = useCallback(() => {
    clearErrors();
    reset();
    setSelectedColor(defaultColor);
    setShowColorPicker(false);
    onCancel?.();
  }, [onCancel]);

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
    setValue('color', e.target.value);
  }, []);

  const onColorPick = useCallback((color: string) => {
    setSelectedColor(color);
    setValue('color', color);
  }, []);

  /**
   * Handles form submission, adding a new category if not a duplicate.
   * @param data - Form data for the new category.
   */
  const onSubmit = useCallback((data: BankCategorySchemaType) => {
    const isDuplicate = categories.some(
      (cat) => cat.name.trim().toLowerCase() === data.name.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError('name', {
        type: 'manual',
        message: 'This category already exists',
      });
      return;
    }

    setCategories((draft) => {
      draft.push({ ...data, expenses: '0' });
    });
    handleCancel();
  }, []);

  return {
    selectedColor,
    setSelectedColor,
    showColorPicker,
    setShowColorPicker,
    register,
    handleSubmit,
    errors,
    setValue,
    handleCancel,
    onSubmit,
    onColorPick,
    onInputChange,
  };
};
