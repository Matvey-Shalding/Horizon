import clsx from 'clsx';
import { MenuStatus } from 'constants/menuStatuses';
import { useCategorySectionState } from 'hooks/useCategorySectionState.hook';
import { Button } from 'ui/Button';
import { AddCategory } from './AddCategory';
import { CategorySectionDefault } from './menu/Default';
import { CategorySectionEdit } from './menu/Edit';
import { CategorySectionDelete } from './menu/Delete';

export function CategorySection({
  status,
  setStatus,
  activeTab,
}: {
  status: MenuStatus;
  setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>;
  activeTab: number;
}) {
  const {
    banks,
    categories,
    menuOpen,
    setMenuOpen,
    deletedCategories,
    setDeletedCategories,
    myCategories,
    setMyCategories,
    currentBank,
    commonProps,
  } = useCategorySectionState({ status, setStatus, activeTab });

  if (categories.length === 0) {
    if (menuOpen) {
      return (
        <div className="pb-13">
          <AddCategory
            onCancel={() => setMenuOpen(false)}
            categories={myCategories}
            setCategories={setMyCategories}
          />
        </div>
      );
    } else {
      return (
        <div
          className={clsx(
            'border-border flex h-full basis-full flex-col',
            'items-center justify-center gap-y-4 border-t border-solid'
          )}
        >
          <span className="text-dark-gray text-xl font-semibold">You have no banks yet</span>
          <Button
            onClick={() => setMenuOpen(true)}
            content="Add category"
          />
        </div>
      );
    }
  }

  switch (status) {
    case 'DEFAULT':
      return (
        <CategorySectionDefault
          currentBank={currentBank}
          {...commonProps}
          setDeletedCategories={setDeletedCategories}
        />
      );
    case 'EDIT':
      return <CategorySectionEdit {...commonProps} />;
    case 'DELETE':
      return (
        <CategorySectionDelete
          currentBank={currentBank}
          {...commonProps}
          deletedCategories={deletedCategories}
          setDeletedCategories={setDeletedCategories}
        />
      );
    default:
      return null;
  }
}
