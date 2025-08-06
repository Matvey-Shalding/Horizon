import { MENU_STATUSES, MenuStatus } from 'constant/menuStatuses';
import { m } from 'framer-motion';
import { useCategory } from 'hooks/useCategory.hook';
import { useCallback, useEffect, useState } from 'react';
import { Bank } from 'types/Bank.interface';
import { Category as type } from 'types/Category.interface';
import { Checkbox } from 'ui/Checkbox';
import { Updater } from 'use-immer';

interface CategoryProps {
  category: type;
  status?: MenuStatus;
  setDeletedCategories: Updater<string[]>;
  deletedCategories?: string[];
  currentBank: Bank;
}

export function Category({
  category,
  status = MENU_STATUSES.DEFAULT,
  setDeletedCategories,
  deletedCategories,
  currentBank,
}: CategoryProps) {
  const { amountLeft, progress, bgColor, progressColor, labelColor, name, color } = useCategory(
    category,
    currentBank
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDeletedCategories((draft) => {
        if (e.target.checked) {
          draft.push(name);
        } else {
          const index = draft.indexOf(name);
          if (index !== -1) draft.splice(index, 1);
        }
      });
    },
    [name, setDeletedCategories]
  );

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(deletedCategories?.includes(name) || false);
  }, [deletedCategories, name]);

  return (
    <div className="flex items-center gap-x-5">
      {status === MENU_STATUSES.DELETE && (
        <Checkbox
          checked={isChecked}
          onChange={onChange}
          style={{ backgroundColor: bgColor }}
          checkBoxStyles="w-6 h-6"
          checkMarkStyles="w-5 h-5"
        />
      )}
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-opacity-50 relative basis-full rounded-xl border p-4"
        style={{ backgroundColor: bgColor }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span
            style={{ color }}
            className="text-sm font-medium"
          >
            {name}
          </span>
          <span
            style={{ color: labelColor }}
            className="text-sm"
          >
            ${amountLeft} left
          </span>
        </div>
        <div
          style={{ backgroundColor: progressColor }}
          className="h-2.5 w-full rounded-full"
        >
          <m.div
            style={{ backgroundColor: color }}
            className="h-2.5 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </m.div>
    </div>
  );
}
