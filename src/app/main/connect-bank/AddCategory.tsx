import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_COLOR } from "constants/DefaultColor";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import {
  bankCategorySchema,
  bankCategorySchemaType,
} from "schemas/bankCategory.schema";
import { connectBankService } from "services/ConnectBank.service";
import { Category } from "types/Category.interface";
import { Button } from "ui/Button";
import { ErrorMessage } from "ui/Error";
import { Input } from "ui/Input";
import { Updater } from "use-immer";
import Plus from "../../../components/icons/main/home/plus";

export function AddCategory({
  categories,
  setCategories,
}: {
  categories: Category[];
  setCategories: Updater<Category[]>;
}) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);

  // Color picker logic

  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".color-picker-container")) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<bankCategorySchemaType>({
    resolver: zodResolver(bankCategorySchema),
    defaultValues: {
      name: "",
      color: DEFAULT_COLOR,
    },
  });

  if (!open) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex basis-full justify-between"
      >
        <span className="text-dark text-lg font-medium">Categories</span>
        <motion.div
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="flex cursor-pointer items-center gap-x-1"
        >
          <Plus className="fill-light-blue stroke-light-blue text-light-blue" />
          <span className="text-light-blue text-sm font-semibold">
            Add category
          </span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="add-category"
        initial={{ height: 0, opacity: 0, scale: 0.9 }}
        animate={{ height: "auto", opacity: 1, scale: 1 }}
        exit={{ height: 0, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
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
                  {...{ defaultValue: selectedColor }}
                  label="Category color"
                  placeholder="Enter color code"
                  register={register}
                  fieldRegister="color"
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    setValue("color", e.target.value);
                  }}
                />
              </div>
              <motion.div
                className="color-picker-container border-border h-11 basis-12 cursor-pointer rounded-full border border-solid"
                style={{ backgroundColor: selectedColor }}
                onClick={() => setShowColorPicker(!showColorPicker)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
              <AnimatePresence>
                {showColorPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="color-picker-container border-border absolute top-full right-0 z-30 mt-2 rounded-md border border-solid bg-white p-2 shadow-md"
                  >
                    <HexColorPicker
                      className="h-25 w-25"
                      color={selectedColor}
                      onChange={(color) => {
                        setSelectedColor(color);
                        setValue("color", color);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ErrorMessage message={errors.color?.message} />
          </div>

          <div className="-mt-2 mb-2">
            <ErrorMessage message={errors.root?.message} />
          </div>

          <div className="grid grid-cols-2 gap-x-3">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="shadow-main text-dark-gray border font-semibold"
              onClick={() => {
                connectBankService.closeCategoryMenu(
                  clearErrors,
                  setShowColorPicker,
                  setOpen,
                  reset,
                  setSelectedColor
                );
              }}
              type="button"
            >
              Cancel
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmit((data) => {
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
                })}
                content="Add Category"
                props={{
                  type: "button",
                }}
              />
            </motion.div>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
