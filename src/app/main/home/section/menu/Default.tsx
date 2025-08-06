import { MenuStatus } from '@/constants/menuStatuses';
import Dropdown from 'components/icons/main/home/dropdown';
import { useCallback } from 'react';
import { Bank } from 'types/Bank.interface';
import { Category as CategoryComponent } from 'ui/Category';
import { Updater } from 'use-immer';
import { Menu } from '../../Menu';

export function CategorySectionDefault({
  status,
  setStatus,
  categories,
  open,
  setOpen,
  setDeletedCategories,
  currentBank,
}: {
  currentBank: Bank;
  status: MenuStatus;
  setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>;
  categories: any[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletedCategories: Updater<string[]>;
}) {
  const onClick = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <div className="border-border relative flex flex-col gap-y-6 border-t border-solid pt-6 pb-10">
      <div className="border-border flex justify-between border-b border-solid pb-1">
        <span className="text-dark items-center text-lg font-semibold">My budgets</span>
        <div className="relative pl-4">
          <div
            className="_dropdown"
            onClick={onClick}
          >
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
      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryComponent
            currentBank={currentBank}
            key={category.name}
            category={category}
            status={status}
            setDeletedCategories={setDeletedCategories}
          />
        ))}
      </div>
    </div>
  );
}
