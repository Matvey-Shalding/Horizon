import { useMediaQuery } from "@react-hookz/web";
import chroma from "chroma-js";
import Arrow from "components/icons/main/transactions/arrow";
import CategoryIcon from "components/icons/main/transactions/category";
import CheckMark from "components/icons/main/transactions/checkmark";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { PaymentTransferSchemaType } from "schemas/paymentTransfer.schema";
import { MEDIA_QUERIES } from "settings/MediaQueries";
import { Category } from "types/Category.interface";
import { ErrorMessage } from "ui/Error";
import { shortenString } from "utils/shortenTitle";
import { v4 } from "uuid";
import { Subtitle } from "./SubTitle";
import clsx from 'clsx';

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
  const isDesktop = useMediaQuery(`(min-width:${MEDIA_QUERIES.DESKTOPS})`);

  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setSelected("");
    setIsOpen(false);
    setValue("categoryId", "");
  }, [resetCounter, setValue]);

  const isTablet = useMediaQuery(`(max-width:${MEDIA_QUERIES.TABLETS})`);

  return (
    <div className="border-border flex border-b pb-2.5 min-[450px]:pb-4 min-[768px]:gap-x-8 min-[768px]:pb-5">
      {!isTablet && <Subtitle title={title} subtitle={subtitle} />}
      <div className="flex basis-full flex-col gap-y-1 min-[640px]:max-w-128">
        {isTablet && (
          <span className="text-dark-gray text-sm/snug font-semibold">
            {subtitle}
          </span>
        )}
        <div className="flex flex-col gap-y-1.5">
          <div
            ref={ref}
            className={`relative flex min-h-11 cursor-pointer items-center justify-between rounded-lg border bg-white pr-4.5 pl-3 transition-all duration-200 hover:border-blue-400 hover:shadow-md`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <div className="flex items-center gap-x-1">
              <CategoryIcon
                className="stroke-dark-gray"
                width={isDesktop ? 24 : 20}
                height={isDesktop ? 24 : 20}
              />
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
                  className="absolute -top-2 -translate-y-full right-0 z-10 flex w-60 flex-col overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-md min-[768px]:w-70"
                >
                  {categories.length === 0 ? (
                    <div className="text-light-gray px-4 py-3 text-center text-sm font-medium">
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
                          className={clsx(
                            "border-border flex cursor-pointer items-center gap-x-2 border-b px-4 py-2 text-sm font-medium min-[768px]:gap-x-3",
                            "transition-colors duration-150 ease-in-out",
                            selected === category.name
                              ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900",
                          )}
                        >
                          <div className="flex w-full basis-full items-center justify-between">
                            <div className="flex items-center gap-x-2 min-[768px]:gap-x-3">
                              <div
                                style={{
                                  backgroundColor: bg,
                                  color: textColor,
                                }}
                                className="grid size-[25px] place-content-center rounded-full text-xs font-medium min-[768px]:size-8 min-[768px]:text-sm"
                              >
                                {shortenString(category.name)}
                              </div>
                              <span className="text-dark-gray font-semibold">
                                {category.name}
                              </span>
                            </div>
                            {category.name === selected && (
                              <CheckMark width={16} height={16} />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <ErrorMessage message={errorMessage} />
      </div>
    </div>
  );
}
