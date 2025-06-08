import clsx from "clsx";
import Arrow from "components/icons/main/transactions/arrow";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { transactionFilterService } from "services/Transactions.service";
import { Checkbox } from "ui/Checkbox";
import { Input } from "ui/Input";
import { Category } from "types/Category.interface";

interface CategoryWithBank extends Category {
  bank: { cardId: string; cardholderName: string };
}

interface CategoryFilterProps {
  isOpen: boolean;
  setIsOpen: () => void;
  categories: CategoryWithBank[];
  selectedCategories: CategoryWithBank[];
  toggleCategory: (category: CategoryWithBank) => void;
}

export function CategoryFilter({
  isOpen,
  setIsOpen,
  categories,
  selectedCategories,
  toggleCategory,
}: CategoryFilterProps) {
  const [categorySearch, setCategorySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoryListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categoryListRef.current) {
      const maxHeight = window.innerHeight - 80 - categoryListRef.current.getBoundingClientRect().top;
      categoryListRef.current.style.maxHeight = `${maxHeight}px`;
      categoryListRef.current.style.overflowY = "auto";
    }
  }, [isOpen]);

  const filteredCategories = transactionFilterService.getFilteredCategories(categories, categorySearch);

  return (
    <div className="flex flex-col gap-y-2">
      <label
        className={clsx(
          "flex cursor-pointer items-center justify-between select-none",
          "border-border border-t pt-2.5",
          isOpen && "border-b pb-1",
        )}
        onClick={setIsOpen}
      >
        <span className="text-blue font-semibold">Category</span>
        <Arrow className={clsx("transition-transform", isOpen ? "rotate-180" : "rotate-0")} />
      </label>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-y-1">
              <Input
                placeholder="Search categories"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
              <div ref={categoryListRef} className="flex flex-col gap-y-2">
                {filteredCategories.length > 0 ? (
                  filteredCategories.slice(0, showAllCategories ? undefined : 3).map((category) => (
                    <label
                      key={category.name}
                      className={clsx("text-gray flex items-center gap-2 py-[4.25px] pl-1 font-medium")}
                    >
                      <Checkbox
                        checkBoxStyles="w-5 h-5"
                        checked={selectedCategories.some((cat) => cat.name === category.name)}
                        onChange={() => toggleCategory(category)}
                      />
                      <span className="text-gray-700">{category.name}</span>
                    </label>
                  ))
                ) : (
                  <label className="px-4 py-2 text-center text-sm text-gray-500 italic">
                    No matching categories
                  </label>
                )}
                {filteredCategories.length > 3 && (
                  <button
                    className="text-light-blue flex justify-start px-1 text-sm font-medium hover:bg-gray-100"
                    onClick={() => setShowAllCategories((prev) => !prev)}
                  >
                    {showAllCategories ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}