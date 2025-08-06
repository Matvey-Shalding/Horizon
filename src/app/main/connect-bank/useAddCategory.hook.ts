import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_COLOR } from 'constants/defaultColor';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { bankCategorySchema, BankCategorySchemaType } from 'schemas/bankCategory.schema';
import { connectBankService } from 'services/ConnectBank.service';
import { Category } from 'types/Category.interface';
import { Updater } from 'use-immer';

/**
 * Props for the useAddCategoryState hook.
 */
interface AddCategoryStateProps {
  /** Array of existing categories. */
  categories: Category[];
  /** Function to update the categories array. */
  setCategories: Updater<Category[]>;
}

/**
 * Hook for managing state and form logic in the AddCategory component.
 * @param props - Props containing categories and setCategories.
 * @returns Object containing state, form methods, and handlers for the AddCategory component.
 */
export const useAddCategoryState = ({ categories, setCategories }: AddCategoryStateProps) => {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<BankCategorySchemaType>({
    resolver: zodResolver(bankCategorySchema),
    defaultValues: {
      name: '',
      color: DEFAULT_COLOR,
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
   * Handles input change for the color field.
   * @param e - Change event from the color input.
   */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedColor(e.target.value);
      setValue('color', e.target.value);
    },
    [setValue]
  );

  /**
   * Handles color selection from the HexColorPicker.
   * @param color - Selected color value.
   */
  const handleColorPickerChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
      setValue('color', color);
    },
    [setValue]
  );

  /**
   * Closes the category form and resets state.
   */
  const handleCancel = () => {
    connectBankService.closeCategoryMenu(clearErrors, setShowColorPicker, setOpen, reset, setSelectedColor);
  };

  /**
   * Adds a new category and resets the form.
   * @param data - Form data for the new category.
   */
  const handleAddCategory = (data: BankCategorySchemaType) => {
    connectBankService.addCategory(
      data,
      categories,
      setError,
      clearErrors,
      setShowColorPicker,
      setOpen,
      setCategories,
      reset,
      setSelectedColor
    );
  };

  return {
    open,
    setOpen,
    selectedColor,
    showColorPicker,
    setShowColorPicker,
    register,
    handleSubmit,
    errors,
    handleChange,
    handleColorPickerChange,
    handleCancel,
    handleAddCategory,
  };
};
