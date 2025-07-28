"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Plus from "components/icons/main/home/plus";
import { DEFAULT_COLOR } from "constants/DefaultColor";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import {
  bankCategorySchema,
  bankCategorySchemaType,
} from "schemas/bankCategory.schema";
import { Category } from "types/Category.interface";
import { Button } from "ui/Button";
import { ErrorMessage } from "ui/Error";
import { Input } from "ui/Input";
import { Updater } from "use-immer";
import { CancelButton } from './CancelButton';

interface AddCategoryFormProps {
  categories: Category[];
  setCategories: Updater<Category[]>;
  defaultColor?: string;
  onCancel?: () => void;
}

export function AddCategoryForm({
  categories,
  setCategories,
  defaultColor = DEFAULT_COLOR,
  onCancel,
}: AddCategoryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<bankCategorySchemaType>({
    resolver: zodResolver(bankCategorySchema),
    defaultValues: {
      name: "",
      color: defaultColor,
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".color-picker-container")) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCancel = () => {
    clearErrors();
    reset();
    setSelectedColor(defaultColor);
    setShowColorPicker(false);
    setIsOpen(false);
    if (onCancel) onCancel();
  };

  const onSubmit = (data: bankCategorySchemaType) => {
    const isDuplicate = categories.some(
      (cat) => cat.name.trim().toLowerCase() === data.name.trim().toLowerCase(),
    );

    if (isDuplicate) {
      setError("name", {
        type: "manual",
        message: "This category already exists",
      });
      return;
    }

    setCategories((draft) => {
      draft.push({ ...data, expenses: "0" });
    });
    handleCancel();
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex basis-full items-center justify-between"
      >
        <span className="text-dark text-lg font-medium">Categories</span>
        <motion.div
          onClick={() => setIsOpen(true)}
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
        <span className="text-dark border-border border-b pb-1 text-lg font-semibold">
          Add new category
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-1.5 min-[450px]:gap-y-2 min-[640px]:gap-y-3"
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
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    setValue("color", e.target.value);
                  }}
                />
              </div>
              <motion.div
                className="color-picker-container h-11 basis-12 cursor-pointer rounded-full border border-solid"
                style={{ backgroundColor: selectedColor }}
                onClick={() => setShowColorPicker((prev) => !prev)}
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
                    className="color-picker-container absolute top-full right-0 z-30 mt-2 rounded-md border bg-white p-2 shadow-md"
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

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-x-3">
            <CancelButton
              content="Cancel"
              onClick={handleCancel}
              props={{ type: "button" }}
            />
            <Button content="Add Category" props={{ type: "button" }} />
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
