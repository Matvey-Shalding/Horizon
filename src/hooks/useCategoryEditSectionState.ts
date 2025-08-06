import { MenuStatus } from '@/constants/menuStatuses';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { bankCategorySchema } from 'schemas/bankCategory.schema';
import { authorizationService } from 'services/Authorization.service';
import { editCategoryService } from 'services/category/EditCategory.service';
import { setBanks } from 'state/main/bankSlice';
import { RootState } from 'state/store';
import { Category } from 'types/Category.interface';
import { useImmer } from 'use-immer';
import { z } from 'zod';

/**
 * Props for the useCategorySectionEditState hook.
 */
interface CategorySectionEditStateProps {
  status: MenuStatus;
  setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>;
  activeTab: number;
  banks: any;
  categories: Category[];
  dispatch: any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Schema for the category edit form with unique name validation.
 */
const CategoryFormSchema = z.object({
  categories: z.array(bankCategorySchema).superRefine((categories, ctx) => {
    const names = categories.map((cat) => cat.name.trim().toLowerCase());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category names must be unique',
        path: ['root'],
      });
    }
  }),
});

/**
 * Type for the category edit form.
 */
type CategoryForm = z.infer<typeof CategoryFormSchema>;

/**
 * Hook for managing state and form logic in the CategorySectionEdit component.
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
  const user = useSelector((state: RootState) => state.user.user);
  const [editedCategories, setEditedCategories] = useImmer<Category[]>(categories);
  const [colorPickerOpen, setColorPickerOpen] = useState<Record<number, boolean>>({});
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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
   */
  const onSubmit: SubmitHandler<CategoryForm> = async (data) => {
    const updatedBanks = [...banks];
    updatedBanks[activeTab] = { ...updatedBanks[activeTab], categories: data.categories };
    dispatch(setBanks(updatedBanks));
    setStatus('DEFAULT');
    authorizationService.handleSaveData(user, updatedBanks);
  };

  /**
   * Handles form cancellation, resetting state and status.
   */
  const handleCancel = () => {
    editCategoryService.handleCancel(setStatus, setEditedCategories);
  };

  /**
   * Toggles the color picker for a specific category index.
   */
  const toggleColorPicker = (index: number) => {
    setColorPickerOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  /**
   * Updates the color of a category at the specified index and syncs with form.
   */
  const updateCategoryColor = (index: number, color: string) => {
    setEditedCategories((draft) => {
      draft[index].color = color;
    });
    setValue(`categories.${index}.color`, color, { shouldValidate: true });
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
    reset,
    setValue,
  };
};
