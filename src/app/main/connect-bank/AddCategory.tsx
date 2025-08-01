import { AnimatePresence, m } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { Button } from 'ui/Button';
import { ErrorMessage } from 'ui/Error';
import { Input } from 'ui/Input';
import Plus from 'components/icons/main/home/plus';
import { useAddCategoryState } from './useAddCategory.hook';
import { Category } from 'types/Category.interface';
import { Updater } from 'use-immer';

interface AddCategoryProps {
  categories: Category[];
  setCategories: Updater<Category[]>;
}

export function AddCategory({ categories, setCategories }: AddCategoryProps) {
  const {
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
  } = useAddCategoryState({ categories, setCategories });

  if (!open) {
    return (
      <m.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex basis-full justify-between"
      >
        <span className="text-dark text-lg font-medium">Categories</span>
        <m.div
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="flex cursor-pointer items-center gap-x-1"
        >
          <Plus className="fill-light-blue stroke-light-blue text-light-blue" />
          <span className="text-light-blue text-sm font-semibold">Add category</span>
        </m.div>
      </m.div>
    );
  }

  return (
    <AnimatePresence>
      <m.div
        key="add-category"
        initial={{ height: 0, opacity: 0, scale: 0.9 }}
        animate={{ height: 'auto', opacity: 1, scale: 1 }}
        exit={{ height: 0, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="border-border flex flex-col gap-2 border-t border-solid py-2"
      >
        <form className="space-y-3">
          <div className="flex flex-col gap-y-1">
            <Input
              label="Category Name"
              placeholder="Enter category name"
              register={register}
              fieldRegister="name"
            />
            <ErrorMessage message={errors.name?.message} />
          </div>

          <div className="flex flex-col gap-y-1">
            <div className="relative flex items-end gap-2">
              <div className="basis-full">
                <Input
                  defaultValue={selectedColor}
                  label="Category color"
                  placeholder="Enter color code"
                  register={register}
                  fieldRegister="color"
                  onChange={handleChange}
                />
              </div>
              <m.div
                className="color-picker-container border-border h-11 basis-12 cursor-pointer rounded-full border border-solid"
                style={{ backgroundColor: selectedColor }}
                onClick={() => setShowColorPicker(!showColorPicker)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
              <AnimatePresence>
                {showColorPicker && (
                  <m.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="color-picker-container border-border absolute top-full right-0 z-30 mt-2 rounded-md border border-solid bg-white p-2 shadow-md"
                  >
                    <HexColorPicker
                      className="h-25 w-25"
                      color={selectedColor}
                      onChange={handleColorPickerChange}
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </div>
            <ErrorMessage message={errors.color?.message} />
          </div>

          <div className="-mt-2 mb-2">
            <ErrorMessage message={errors.root?.message} />
          </div>

          <div className="grid grid-cols-2 gap-x-3">
            <m.button
              whileHover={{ scale: 1.05, boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="shadow-main text-dark-gray border font-semibold"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </m.button>
            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmit(handleAddCategory)}
                content="Add Category"
                props={{ type: 'button' }}
              />
            </m.div>
          </div>
        </form>
      </m.div>
    </AnimatePresence>
  );
}
