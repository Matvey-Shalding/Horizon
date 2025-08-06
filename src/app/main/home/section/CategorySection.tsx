import { MenuStatus } from '@/constants/menuStatuses';
import { useCategorySectionState } from 'hooks/useCategorySectionState.hook';
import { AddCategory } from './AddCategory';
import { CategorySectionDefault } from './menu/Default';
import { CategorySectionDelete } from './menu/Delete';
import { CategorySectionEdit } from './menu/Edit';

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
        <div className="border-border grid h-full basis-full place-content-center border-t px-4 pt-2">
          <span className="text-dark-gray block text-center text-2xl font-semibold">
            You don't have any categories
          </span>
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
