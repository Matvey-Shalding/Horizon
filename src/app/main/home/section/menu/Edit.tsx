import { AddCategory } from 'app/main/connect-bank/AddCategory';
import clsx from 'clsx';
import Dropdown from 'components/icons/main/home/dropdown';
import { MenuStatus } from 'constants/menuStatuses';
import { AnimatePresence, m } from 'framer-motion';
import { useCategorySectionEditState } from 'hooks/useCategoryEditSectionState';
import { useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import 'styles/lib/colorPicker.css';
import { Category } from 'types/Category.interface';
import { Button } from 'ui/Button';
import { CancelButton } from 'ui/CancelButton';
import { ErrorMessage } from 'ui/Error';
import { Input } from 'ui/Input';
import { Menu } from '../../Menu';

export function CategorySectionEdit({
  status,
  setStatus,
  activeTab,
  banks,
  categories,
  dispatch,
  open,
  setOpen,
}: {
  status: MenuStatus;
  setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>;
  activeTab: number;
  banks: any;
  categories: Category[];
  dispatch: any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    editedCategories,
    setEditedCategories,
    colorPickerOpen,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleCancel,
    toggleColorPicker,
    updateCategoryColor,
    setColorPickerOpen,
    reset,
  } = useCategorySectionEditState({
    status,
    setStatus,
    activeTab,
    banks,
    categories,
    dispatch,
    open,
    setOpen,
  });

  const colorPickerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const colorPickerPopupRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      console.log(!Boolean(target.closest('._modal')) && !Boolean(target.closest('._preview')));

      if (!Boolean(target.closest('._modal')) && !Boolean(target.closest('._preview'))) {
        setColorPickerOpen((prev) => Object.fromEntries(Object.keys(prev).map((key) => [key, false])));
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    reset({ categories });
  }, [categories, reset]);

  return (
    <div className="border-border relative flex flex-col gap-y-1 border-t border-solid pt-6 pb-10">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b border-solid pb-1">
        <span className="text-dark text-lg font-semibold">Edit Budgets</span>
        <div className="relative pl-4">
          <div
            className="_dropdown"
            onClick={() => void setOpen((prev) => !prev)}
          >
            <Dropdown />
          </div>
          <Menu
            open={open}
            setOpen={setOpen}
            status={status}
            setStatus={setStatus}
          />
        </div>
      </div>

      {/* Form-level Error for Duplicate Names */}
      <div className="mt-1">
        <ErrorMessage message={errors.categories?.root?.message} />
      </div>

      {/* Category Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="my-form"
      >
        <div className="mt-3 space-y-4">
          {editedCategories.map((category, index) => (
            <div
              key={index}
              className="border-border flex flex-col gap-y-2 rounded border bg-white p-3.5 shadow-sm"
            >
              {/* Category Name Input */}
              <div className="flex flex-col gap-y-1">
                <Input
                  label="Category Name"
                  placeholder=""
                  defaultValue={category.name}
                  register={register}
                  fieldRegister={`categories.${index}.name`}
                />
                <ErrorMessage message={errors.categories?.[index]?.name?.message} />
              </div>

              {/* Category Color Input */}
              <div className="relative flex items-end gap-x-2">
                <div className="basis-full">
                  <div className="flex flex-col gap-y-1">
                    <Input
                      placeholder=""
                      label="Category Color"
                      value={category.color}
                      register={register}
                      fieldRegister={`categories.${index}.color`}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateCategoryColor(index, e.target.value);
                      }}
                    />
                    <ErrorMessage message={errors.categories?.[index]?.color?.message} />
                  </div>
                </div>
                <div className="relative mt-2 cursor-pointer">
                  <m.div
                    onClick={() => toggleColorPicker(index)}
                    className="border-border _preview mb-1 size-11 rounded-full border"
                    style={{ backgroundColor: category.color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <AnimatePresence>
                    {colorPickerOpen[index] && (
                      <m.div
                        ref={(el) => {
                          colorPickerPopupRefs.current[index] = el;
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.2 }}
                        className="_modal absolute top-full right-0 z-30 mt-2"
                      >
                        <HexColorPicker
                          className={clsx(
                            'border-border h-40 w-40 rounded-lg border bg-white',
                            'p-2 shadow-md sm:h-48 sm:w-48 md:h-56 md:w-56'
                          )}
                          color={category.color}
                          onChange={(color: string) => {
                            updateCategoryColor(index, color);
                          }}
                        />
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>

      <div className="border-border border-main mt-1 border-b pb-1">
        <AddCategory
          categories={editedCategories}
          setCategories={setEditedCategories}
        />
      </div>

      <div className="mt-1 grid grid-cols-2 gap-x-3">
        <CancelButton onClick={handleCancel} />
        <Button
          className="text-white"
          content="Save"
          props={{ type: 'submit', form: 'my-form' }}
        />
      </div>
    </div>
  );
}
