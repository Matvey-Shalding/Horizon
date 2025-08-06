/**
 * Menu status constants for UI state management.
 */
export const MENU_STATUSES = {
  /** Default menu state. */
  DEFAULT: 'DEFAULT',
  /** Menu state for editing. */
  EDIT: 'EDIT',
  /** Menu state for deletion. */
  DELETE: 'DELETE',
} as const;

/**
 * Type for valid menu status keys.
 */
export type MenuStatus = keyof typeof MENU_STATUSES;
