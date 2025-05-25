import chroma from "chroma-js";
import Arrow from "components/icons/main/transactions/arrow";
import CategoryIcon from "components/icons/main/transactions/category";
import CheckMark from "components/icons/main/transactions/checkmark";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { PaymentTransferSchemaType } from "schemas/paymentTransfer.schema";
import { Category } from "types/Category.interface";
import { ErrorMessage } from "ui/Error";
import { shortenString } from "utils/shortenTitle";
import { v4 } from "uuid";
import { Subtitle } from "./SubTitle";

export function CategoryDropdown<T>({
  title,
  subtitle,
  errorMessage,
  setValue,
  categories,
  resetCounter,
}: {
  title: string;
  subtitle: string;
  errorMessage?: string;
  categories: Category[];
  setValue: UseFormSetValue<PaymentTransferSchemaType>;
  resetCounter: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setSelected("");
    setIsOpen(false);
    setValue("categoryId", "");
  }, [resetCounter, setValue]);

  return (
    <div className="border-border flex gap-x-8 border-b pb-5">
      <Subtitle title={title} subtitle={subtitle} />
      <div className="flex flex-col gap-y-1">
        <div
          ref={ref}
          className={`relative flex min-h-11 w-128 cursor-pointer items-center justify-between rounded-lg border bg-white pr-4.5 pl-3 transition-all duration-200 hover:border-blue-400 hover:shadow-md`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-x-1">
            <CategoryIcon height={16} width={24} />
            <span className="text-dark-gray text-sm font-medium">
              {selected
                ? categories.find((b) => b.name === selected)?.name
                : "Select Category"}
            </span>
          </div>
          <Arrow
            className={`${isOpen ? "rotate-180" : ""} transition-transform`}
          />

          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="category-dropdown"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="shadow-main absolute top-[calc(100%+10px)] right-0 z-10 flex w-100 flex-col overflow-hidden rounded-lg bg-white"
              >
                {categories.length === 0 ? (
                  <div className="px-4 py-3 text-center text-sm text-light-gray font-medium italic">
                    Please select the source bank first
                  </div>
                ) : (
                  categories.map((category) => {
                    const bg = category.color;
                    const textColor =
                      chroma(bg).luminance() > 0.5 ? "#000" : "#fff";

                    return (
                      <div
                        key={v4()}
                        onClick={() => {
                          setSelected(category.name);
                          setValue("categoryId", category.name, {
                            shouldValidate: true,
                          });
                          setTimeout(() => setIsOpen(false), 0);
                        }}
                        className="group border-border flex min-h-14 w-full items-center justify-between gap-x-3 border-b px-4 transition-colors duration-200 hover:bg-gray-100"
                      >
                        <motion.div
                          style={{ backgroundColor: bg, color: textColor }}
                          className="grid h-8 w-8 place-content-center rounded-full text-sm font-medium transition-transform duration-200 group-hover:scale-110"
                        >
                          {shortenString(category.name)}
                        </motion.div>
                        <span className="text-dark-gray font-semibold">
                          {category.name}
                        </span>
                        {category.name === selected && <CheckMark />}
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ErrorMessage message={errorMessage} />
      </div>
    </div>
  );
}
