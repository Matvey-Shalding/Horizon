import { Dispatch } from '@reduxjs/toolkit';
import { MenuStatus } from 'constant/menuStatuses';
import { m } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteCategoryService } from 'services/category/DeleteCategory.service';
import { RootState } from 'state/store';
import { Bank } from 'types/Bank.interface';
import { Category } from 'types/Category.interface';
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
  banks: Bank[];
  categories: Category[];
  dispatch: Dispatch;
  deletedCategories: string[];
  setDeletedCategories: Updater<string[]>;
  currentBank: Bank;
}) {
  const [checkAll, setCheckAll] = useState(false);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    deleteCategoryService.handleCheckAll(e, categories, setCheckAll, setDeletedCategories);
  }, []);

  const onCancel = useCallback(
    () => deleteCategoryService.handleCancel(setStatus, setDeletedCategories, setCheckAll),
    []
  );

  const user = useSelector((state: RootState) => state.user.user);

  const onSubmit = async () => {
    deleteCategoryService.handleDelete(
      banks,
      activeTab,
      categories,
      deletedCategories,
      dispatch,
      setStatus,
      setDeletedCategories,
      setCheckAll,
      user
    );
  };

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
            onChange={onChange}
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
        <m.button
          onClick={onCancel}
          whileHover={{ scale: 1.05, boxShadow: '0 5px 10px rgba(0,0,0,0.2)' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="shadow-main text-dark-gray border p-2 font-semibold"
        >
          Cancel
        </m.button>
        <Button
          onClick={() => {
            onSubmit();
          }}
          className="text-white"
          content="Delete"
        />
      </div>
    </div>
  );
}
