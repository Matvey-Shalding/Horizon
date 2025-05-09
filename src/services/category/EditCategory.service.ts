import { Dispatch } from "@reduxjs/toolkit";
import { MENU_STATUSES, MenuStatus } from "constants/MenuStatuses";
import { bankCategorySchemaType } from "schemas/bankCategory.schema";
import { setBanks } from "state/main/bankSlice";
import { Category } from "types/Category.interface";
import { Updater } from "use-immer";

class CategoryService {
  resetSelection(
    setEditedCategories: Updater<bankCategorySchemaType[]>,
    setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>,
  ) {
    setStatus(MENU_STATUSES.DEFAULT); // Reset the status to default
    setEditedCategories([]); // Reset the categories to empty
  }

  // Handle the cancel action
  handleCancel(
    setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>,
    setEditedCategories: Updater<bankCategorySchemaType[]>,
  ) {
    this.resetSelection(setEditedCategories, setStatus); // Reset categories and status
  }

  // Handle the submit action (saving the data)
  handleSubmit(
    banks: any[],
    activeTab: number,
    dispatch: Dispatch,
    setStatus: React.Dispatch<React.SetStateAction<MenuStatus>>,
    data: Category[],
  ) {
    const updatedBanks = [...banks];
    updatedBanks[activeTab] = {
      ...updatedBanks[activeTab],
      categories: data,
    };
    dispatch(setBanks(updatedBanks));
    setStatus(MENU_STATUSES.DEFAULT); // Reset the status to default
  }
}

// Export an instance of the service for use
export const editCategoryService = new CategoryService();
