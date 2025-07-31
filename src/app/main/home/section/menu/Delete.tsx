import { Dispatch } from '@reduxjs/toolkit';
import { MenuStatus } from 'constants/MenuStatuses';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { deleteCategoryService } from 'services/category/DeleteCategory.service';
import { Bank } from 'types/Bank.interface';
import { Button } from 'ui/Button';
import { Category as CategoryComponent } from 'ui/Category';
import { Checkbox } from 'ui/Checkbox';
import { Label } from 'ui/Label';
import { Updater } from 'use-immer';

export function CategorySectionDelete({
  status,
  setStatus,
  activeTab,
  banks,
  categories,
  dispatch,
  deletedCategories,
  setDeletedCategories,
  currentBank,
}: {
  status: MenuStatus;
  setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>;
  activeTab: number;
  banks: any;
  categories: any[];
  dispatch: Dispatch;
  deletedCategories: string[];
  setDeletedCategories: Updater<string[]>;
  currentBank: Bank;
}) {
  const [checkAll, setCheckAll] = useState(false);
  useEffect(() => {
    setCheckAll(deletedCategories.length === categories.length);
  }, [deletedCategories, categories]);
  return (
    <div className="border-border relative flex flex-col gap-y-6 border-t border-solid pt-6 pb-10">
      <div className="border-border flex items-center justify-between border-b border-solid pb-1">
        <span className="text-dark items-center text-lg font-semibold">
          {deletedCategories.length} selected
        </span>
        <label className="flex items-center gap-x-1.5">
          <Checkbox
            checked={checkAll}
            onChange={(e) =>
              deleteCategoryService.handleCheckAll(e, categories, setCheckAll, setDeletedCategories)
            }
          />
          <Label
            onClick={() => {}}
            color="#475467"
            content="Select all"
          />
        </label>
      </div>
      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryComponent
            currentBank={currentBank}
            key={category.name}
            category={category}
            status={status}
            deletedCategories={deletedCategories}
            setDeletedCategories={setDeletedCategories}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3">
        <motion.button
          onClick={() => deleteCategoryService.handleCancel(setStatus, setDeletedCategories, setCheckAll)}
          whileHover={{ scale: 1.05, boxShadow: '0 5px 10px rgba(0,0,0,0.2)' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="shadow-main text-dark-gray border p-2 font-semibold"
        >
          Cancel
        </motion.button>
        <Button
          onClick={() =>
            deleteCategoryService.handleDelete(
              banks,
              activeTab,
              categories,
              deletedCategories,
              dispatch,
              setStatus,
              setDeletedCategories,
              setCheckAll
            )
          }
          styles="text-white"
          content="Delete"
        />
      </div>
    </div>
  );
}
