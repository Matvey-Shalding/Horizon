import { DEFAULT_COLOR } from 'constant/defaultColor';
import { AnimatePresence, m } from 'framer-motion';
import { useAddCategoryState } from 'hooks/useAddCategory.hook';
import { HexColorPicker } from 'react-colorful';
import { Category } from 'types/Category.interface';
import { Button } from 'ui/Button';
import { ErrorMessage } from 'ui/Error';
import { Input } from 'ui/Input';
import { Updater } from 'use-immer';

interface AddCategoryProps {
  categories: Category[];
  setCategories: Updater<Category[]>;
  defaultColor?: string;
  onCancel?: () => void;
}

export function AddCategory({
  categories,
  setCategories,
  defaultColor = DEFAULT_COLOR,
  onCancel,
}: AddCategoryProps) {
  const {
    selectedColor,
    setSelectedColor,
    showColorPicker,
    setShowColorPicker,
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    handleCancel,
    onColorPick,
    onInputChange,
  } = useAddCategoryState({ categories, setCategories, defaultColor, onCancel });

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
        <span className="text-dark border-border border-b pb-1 text-lg font-semibold">Add new category</span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 space-y-3"
        >
          {/* Category Name */}
          <div className="flex flex-col gap-y-1">
            <Input
              label="Category Name"
              placeholder="Enter category name"
              register={register}
              fieldRegister="name"
            />
            <ErrorMessage message={errors.name?.message} />
          </div>

          {/* Category Color */}
          <div className="flex flex-col gap-y-1">
            <div className="relative flex items-end gap-2">
              <div className="basis-full">
                <Input
                  defaultValue={selectedColor}
                  label="Category color"
                  placeholder="Enter color code"
                  register={register}
                  fieldRegister="color"
                  onChange={onInputChange}
                />
              </div>
              <m.div
                className="color-picker-container h-11 basis-12 cursor-pointer rounded-full border border-solid"
                style={{ backgroundColor: selectedColor }}
                onClick={() => setShowColorPicker((prev) => !prev)}
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
                    className="color-picker-container absolute top-full right-0 z-30 mt-2 rounded-md border bg-white p-2 shadow-md"
                  >
                    <HexColorPicker
                      className="h-25 w-25"
                      color={selectedColor}
                      onChange={onColorPick}
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </div>
            <ErrorMessage message={errors.color?.message} />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-x-3">
            <m.button
              type="button"
              onClick={handleCancel}
              whileHover={{ scale: 1.05, boxShadow: '0 5px 10px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="shadow-main text-dark-gray border p-2 font-semibold"
            >
              Cancel
            </m.button>
            <m.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                content="Add Category"
                props={{ type: 'submit' }}
              />
            </m.button>
          </div>
        </form>
      </m.div>
    </AnimatePresence>
  );
}
