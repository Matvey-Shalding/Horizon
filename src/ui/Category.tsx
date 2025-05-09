import { MENU_STATUSES, MenuStatus } from "constants/MenuStatuses";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Category as type } from "types/Category.interface";
import { Checkbox } from "ui/Checkbox";
import { Updater } from "use-immer";
import { hexToRgba } from "utils/hexToRgba";

interface CategoryProps {
  category: type;
  status?: MenuStatus;
  setDeletedCategories: Updater<string[]>;
  deletedCategories?: string[];
}

export function Category({
  category,
  status = MENU_STATUSES.DEFAULT,
  setDeletedCategories,
  deletedCategories,
}: CategoryProps) {
  const { budget, color, name } = category;

  const totalAmount = useMemo(() => parseInt(budget, 10), [budget]);
  const spending = useMemo(() => totalAmount / 2, [totalAmount]);
  const amountLeft = useMemo(
    () => totalAmount - spending,
    [totalAmount, spending],
  );
  const progress = useMemo(
    () => (spending / totalAmount) * 100,
    [spending, totalAmount],
  );

  const bgColor = useMemo(() => hexToRgba(color, 0.2), [color]);
  const progressColor = useMemo(() => hexToRgba(color, 0.55), [color]);
  const labelColor = useMemo(() => hexToRgba(color, 0.9), [color]);

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(deletedCategories?.includes(name) || false);
  }, [deletedCategories, name]);

  return (
    <div className="flex items-center gap-x-5">
      {status === MENU_STATUSES.DELETE && (
        <Checkbox
          checked={isChecked}
          onChange={(e) => {
            setDeletedCategories((draft) => {
              if (e.target.checked) {
                draft.push(name);
              } else {
                const index = draft.indexOf(name);
                if (index !== -1) draft.splice(index, 1);
              }
            });
          }}
          style={{ backgroundColor: bgColor }}
          styles="w-6 h-6"
          svgStyle="w-5 h-5"
        />
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-opacity-50 relative basis-full rounded-[12px] border p-4"
        style={{ backgroundColor: bgColor }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span style={{ color }} className="text-sm font-medium">
            {name}
          </span>
          <span style={{ color: labelColor }} className="text-sm">
            ${amountLeft} left
          </span>
        </div>
        <div
          style={{ backgroundColor: progressColor }}
          className="h-2.5 w-full rounded-full"
        >
          <motion.div
            style={{ backgroundColor: color }}
            className="h-2.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
