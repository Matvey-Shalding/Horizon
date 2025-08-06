import { MenuStatus } from 'constants/menuStatuses';
import { useCategorySectionState } from 'hooks/useCategorySectionState.hook';
import { FallBackPage } from 'ui/FallbackPage';
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
        <div className="h-full basis-full px-4 border-t border-border pt-2 grid place-content-center">
          <span className="text-2xl block font-semibold text-dark-gray text-center">
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
