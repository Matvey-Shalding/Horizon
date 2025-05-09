import { zodResolver } from "@hookform/resolvers/zod";
import { AddCategory } from "app/main/connect-bank/AddCategory";
import Dropdown from "components/icons/main/home/dropdown";
import { MenuStatus } from "constants/MenuStatuses";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  bankCategorySchema,
  bankCategorySchemaType,
} from "schemas/bankCategory.schema";
import { editCategoryService } from "services/category/EditCategory.service";
import { setBanks } from "state/main/bankSlice";
import { Category } from "types/Category.interface";
import { Button } from "ui/Button";
import { CancelButton } from "ui/CancelButton";
import { ErrorMessage } from "ui/Error";
import { Input } from "ui/Input";
import { useImmer } from "use-immer";
import { z } from "zod";
import { Menu } from "../../Menu";

type CategoryForm = {
  categories: bankCategorySchemaType[];
};

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
  const [editedCategories, setEditedCategories] = useImmer(categories);
  const [colorPickerOpen, setColorPickerOpen] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {}, [editedCategories]);

  const CategoryFormSchema = z.object({
    categories: z.array(bankCategorySchema),
  });

  type CategoryForm = z.infer<typeof CategoryFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryForm>({
    resolver: zodResolver(CategoryFormSchema),
  });
  useEffect(() => {
    reset({ categories });
  }, [categories, reset]);

  const onSubmit: SubmitHandler<CategoryForm> = (data) => {
    alert("hello");
    const updatedBanks = [...banks];
    updatedBanks[activeTab] = {
      ...updatedBanks[activeTab],
      categories: data.categories,
    };
    dispatch(setBanks(updatedBanks));
    setStatus("DEFAULT");
  };

  return (
    <div className="border-border relative flex flex-col gap-y-1 border-t border-solid pt-6 pb-10">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b border-solid pb-1">
        <span className="text-dark text-lg font-semibold">Edit Budgets</span>
        <div className="relative">
          <div onClick={() => setOpen((prev) => !prev)}>
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

      {/* Category Form */}
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          alert("An error occurred");
          console.log(errors);
        })}
        id="my-form"
      >
        <div className="mt-3 space-y-4">
          {editedCategories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col gap-y-2 rounded border p-3.5"
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
                <ErrorMessage
                  message={errors.categories?.[index]?.name?.message}
                />
              </div>

              {/* Budget Input */}
              <div className="flex flex-col gap-y-1">
                <Input
                  label="Budget"
                  placeholder=""
                  defaultValue={category.budget}
                  register={register}
                  fieldRegister={`categories.${index}.budget`}
                />
                <ErrorMessage
                  message={errors.categories?.[index]?.budget?.message}
                />
              </div>

              {/* Category Color Input */}
              <div className="relative flex items-end gap-x-2">
                <div className="basis-full">
                  <div className="flex flex-col gap-y-1">
                    <Input
                      placeholder=""
                      label="Category Color"
                      defaultValue={category.color}
                      register={register}
                      fieldRegister={`categories.${index}.color`}
                    />
                    <ErrorMessage
                      message={errors.categories?.[index]?.color?.message}
                    />
                  </div>
                </div>
                <div
                  className="mt-2 cursor-pointer"
                  onClick={() =>
                    setColorPickerOpen((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                >
                  <motion.div
                    className="h-10 w-10 rounded-full border"
                    style={{ backgroundColor: category.color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                </div>
                <AnimatePresence>
                  {colorPickerOpen[index] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-30 mt-2"
                    >
                      <HexColorPicker
                        color={category.color}
                        onChange={(color) =>
                          setEditedCategories((draft) => {
                            draft[index].color = color;
                          })
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </form>

      {/* Add Category Outside the Form */}
      <div className="border-border border-main mt-4 border-b pb-1">
        <AddCategory
          categories={editedCategories}
          setCategories={setEditedCategories}
        />
      </div>

      {/* Buttons Outside but Linked to the Form */}
      <div className="mt-4 grid grid-cols-2 gap-x-3">
        <CancelButton
          onClick={() =>
            editCategoryService.handleCancel(setStatus, setEditedCategories)
          }
        />
        <Button
          // onClick={() => handleSubmit(onSubmit)()} // ✅ This also works
          styles="text-white"
          content="Save"
          props={{ type: "submit", form: "my-form" }}
        />
      </div>
    </div>
  );
}
