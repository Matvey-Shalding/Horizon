import { MenuStatus } from "constants/MenuStatuses";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBanks } from "state/main/bankSlice";
import { RootState } from "state/store";
import { Category } from "types/Category.interface";
import { Button } from "ui/Button";
import { useImmer } from "use-immer";
import { AddCategory } from "./AddCategory";
import { CategorySectionDefault } from "./menu/Default";
import { CategorySectionDelete } from "./menu/Delete";
import { CategorySectionEdit } from "./menu/Edit";

export function CategorySection({
  status,
  setStatus,
  activeTab,
}: {
  status: MenuStatus;
  setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>;
  activeTab: number;
}) {
  const dispatch = useDispatch();
  const banks = useSelector((state: RootState) => state.bank.banks);

  // Derive the categories for the active tab.
  const categories = useMemo(
    () => banks[activeTab].categories,
    [banks, activeTab],
  );

  // Common state used by various modes
  const [open, setOpen] = useState(false);

  // For DELETE mode:
  const [deletedCategories, setDeletedCategories] = useImmer<string[]>([]);

  const [myCategories, setMyCategories] = useImmer<Category[]>([...categories]);

  // Props to pass down to the subcomponents
  const commonProps = useMemo(() => {
    return {
      status,
      setStatus,
      categories,
      open,
      setOpen,
      banks,
      activeTab,
      dispatch,
    };
  }, [status, setStatus, open, setOpen, banks, activeTab, dispatch]);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updatedBanks = banks.map((bank, index) =>
      index === activeTab ? { ...bank, categories: myCategories } : bank,
    );

    dispatch(setBanks(updatedBanks));
  }, [myCategories]);

  if (categories.length === 0) {
    if (menuOpen) {
      return (
        <div className="pb-13">
          {" "}
          <AddCategory
            onCancel={() => void setMenuOpen(false)}
            categories={myCategories}
            setCategories={setMyCategories}
          />
        </div>
      );
    } else {
      return (
        <div className="border-border flex h-full basis-full flex-col items-center justify-center gap-y-4 border-t border-solid">
          <span className="text-dark-gray text-xl font-semibold">
            You have no banks yet
          </span>
          <Button onClick={() => setMenuOpen(true)} content="Add category" />
        </div>
      );
    }
  }

  switch (status) {
    case "DEFAULT":
      return (
        <CategorySectionDefault
          {...commonProps}
          setDeletedCategories={setDeletedCategories}
        />
      );
    case "EDIT":
      return <CategorySectionEdit {...commonProps} />;
    case "DELETE":
      return (
        <CategorySectionDelete
          {...commonProps}
          deletedCategories={deletedCategories}
          setDeletedCategories={setDeletedCategories}
        />
      );
    default:
      return null;
  }
}
