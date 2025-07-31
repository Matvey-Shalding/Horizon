export const MENU_STATUSES = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
} as const;

export type MenuStatus = keyof typeof MENU_STATUSES;
