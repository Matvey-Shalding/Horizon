import { useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useImmer } from 'use-immer';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { bankCategorySchema, BankCategorySchemaType } from 'schemas/bankCategory.schema';
import { Category } from 'types/Category.interface';
import { MenuStatus } from 'constants/menuStatuses';
import { editCategoryService } from 'services/category/EditCategory.service';
import { setBanks } from 'state/main/bankSlice';

/**
 * Props for the useCategorySectionEditState hook.
 */
interface CategorySectionEditStateProps {
  status: MenuStatus;
  setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>;
  activeTab: number;
  banks: any; // Consider defining a proper Bank interface
  categories: Category[];
  dispatch: any; // Consider typing with AppDispatch
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Schema for the category edit form.
 */
const CategoryFormSchema = z.object({
  categories: z.array(bankCategorySchema),
});

/**
 * Type for the category edit form.
 */
type CategoryForm = z.infer<typeof CategoryFormSchema>;

/**
 * Hook for managing state and form logic in the CategorySectionEdit component.
 * @param props - Props for menu status, active tab, banks, categories, dispatch, and dropdown state.
 * @returns Object containing state, form methods, and handlers for the CategorySectionEdit component.
 */
export const useCategorySectionEditState = ({
  status,
  setStatus,
  activeTab,
  banks,
  categories,
  dispatch,
  open,
  setOpen,
}: CategorySectionEditStateProps) => {
  const [editedCategories, setEditedCategories] = useImmer<Category[]>(categories);
  const [colorPickerOpen, setColorPickerOpen] = useState<Record<number, boolean>>({});
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryForm>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: { categories },
  });

  // Reset form when categories change
  useEffect(() => {
    reset({ categories });
  }, [categories, reset]);

  // Handle click outside to close all color pickers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setColorPickerOpen((prev) =>
          Object.fromEntries(Object.entries(prev).map(([key]) => [Number(key), false]))
        );
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handles form submission, updating bank categories and resetting status.
   * @param data - Form data containing updated categories.
   */
  const onSubmit: SubmitHandler<CategoryForm> = (data) => {
    const updatedBanks = [...banks];
    updatedBanks[activeTab] = { ...updatedBanks[activeTab], categories: data.categories };
    dispatch(setBanks(updatedBanks));
    setStatus('DEFAULT');
  };

  /**
   * Handles form cancellation, resetting state and status.
   */
  const handleCancel = () => {
    editCategoryService.handleCancel(setStatus, setEditedCategories);
  };

  /**
   * Toggles the color picker for a specific category index.
   * @param index - Index of the category.
   */
  const toggleColorPicker = (index: number) => {
    setColorPickerOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  /**
   * Updates the color of a category at the specified index.
   * @param index - Index of the category.
   * @param color - New color value.
   */
  const updateCategoryColor = (index: number, color: string) => {
    setEditedCategories((draft) => {
      draft[index].color = color;
    });
  };

  return {
    editedCategories,
    setEditedCategories,
    colorPickerOpen,
    colorPickerRef,
    register,
    handleSubmit,
    errors,
    open,
    setOpen,
    onSubmit,
    handleCancel,
    toggleColorPicker,
    updateCategoryColor,
    setColorPickerOpen,
    reset
  };
};
