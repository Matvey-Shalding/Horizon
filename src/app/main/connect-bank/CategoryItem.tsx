import clsx from 'clsx';
import Delete from 'components/icons/main/home/delete';
import { AnimatePresence, m } from 'framer-motion';
import { useCallback } from 'react';
import { Category } from 'types/Category.interface';
import { Updater } from 'use-immer';

export function CategoryList({
  categories,
  setCategories,
}: {
  categories: Category[];
  setCategories: Updater<Category[]>;
  }) {
  
  const handleClick = useCallback((name:string) => {
    setCategories((array) => array.filter((item) => item.name !== name));
  },[]);
  
  return (
    <div className="border-border mt-0.5 flex flex-col gap-2 border-t border-solid pt-1.5">
      {categories.length === 0 ? (
        <p className="text-center text-sm text-gray-500">No categories available.</p>
      ) : (
        <AnimatePresence>
          {categories.map(({ color, name }) => (
            <m.div
              key={name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                'flex items-center justify-between rounded-md bg-white p-3',
                'shadow transition-shadow duration-200 hover:shadow-md'
              )}
            >
              <div className="flex items-center gap-x-1.5">
                <div
                  className="h-4 w-4 rounded-[7px]"
                  style={{ backgroundColor: color }}
                />
                <span className="text-dark-gray text-base font-medium">{name}</span>
              </div>
              <button
                onClick={() => {
                  handleClick(name)
                }}
                aria-label={`Delete category ${name}`}
                className="flex items-center justify-center rounded p-1"
              >
                <Delete
                  width={20}
                  height={20}
                  className="stroke-gray transition-colors duration-500 hover:stroke-gray-900"
                />
              </button>
            </m.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
