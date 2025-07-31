/**
 * Interface representing a category for expense tracking
 * @interface Category
 */
export interface Category {
  /** The name of the category */
  name: string;
  /** The color associated with the category (e.g., hex code or color name) */
  color: string;
  /** The expenses associated with the category */
  expenses: string;
}
