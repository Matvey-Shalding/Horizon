/**
 * Centralized error messages for Zod schema validations.
 * @constant
 */
export const ERROR_MESSAGES = {
  /** Generic required field error */
  REQUIRED: 'This field is required',
  /** Invalid email format error */
  EMAIL_INVALID: 'Invalid email format. Use a valid email like user@example.com',
  /** Minimum name length error */
  NAME_MIN: (min: number) => `Must be at least ${min} characters`,
  /** Maximum name length error */
  NAME_MAX: (max: number) => `Cannot exceed ${max} characters`,
  /** Minimum password length error */
  PASSWORD_MIN: 'Password must be at least 8 characters',
  /** Maximum password length error */
  PASSWORD_MAX: 'Password cannot exceed 15 characters',
  /** Address minimum length error */
  ADDRESS_MIN: 'Address must be at least 6 characters',
  /** Address maximum length error */
  ADDRESS_MAX: 'Address cannot exceed 100 characters',
  /** State minimum length error */
  STATE_MIN: 'State must be at least 2 characters',
  /** State maximum length error */
  STATE_MAX: 'State cannot exceed 50 characters',
  /** Postal code minimum length error */
  POSTAL_CODE_MIN: 'Postal code must be at least 2 characters',
  /** Postal code maximum length error */
  POSTAL_CODE_MAX: 'Postal code cannot exceed 15 characters',
  /** SSN minimum length error */
  SSN_MIN: 'SSN must be at least 2 characters',
  /** SSN maximum length error */
  SSN_MAX: 'SSN cannot exceed 15 characters',
  /** Invalid date of birth format error */
  DATE_OF_BIRTH_FORMAT: 'Invalid birthdate format. Use YYYY-MM-DD',
  /** Invalid color format error */
  COLOR_FORMAT: 'Color must be in hex format (#xxxxxx)',
  /** Category name required error */
  CATEGORY_NAME_REQUIRED: 'Category name is required',
  /** Bank selection required error */
  BANK_SELECT: 'Please select a bank',
  /** Recipient bank selection required error */
  RECIPIENT_SELECT: 'Please select a recipient bank',
  /** Invalid balance format error */
  BALANCE_FORMAT: 'Enter a valid amount',
  /** Insufficient balance error */
  BALANCE_INSUFFICIENT: 'Insufficient balance in the selected bank',
  /** Category selection required error */
  CATEGORY_SELECT: 'Please select a category',
  /** Maximum email length error */
  EMAIL_MAX: 'Email cannot exceed 100 characters',
  /** Cardholder name required error */
  CARDHOLDER_NAME_REQUIRED: 'Cardholder name is required',
  /** Initial balance required error */
  BALANCE_REQUIRED: 'Initial balance is required',
  /** Monthly budget required error */
  MONTHLY_BUDGET_REQUIRED: 'Monthly budget is required',
  /** Card CVV minimum length error */
  CARD_CVV_MIN: 'Card CVV must be at least 3 digits',
  /** Card ID format error */
  CARD_ID_FORMAT: 'Card ID must be a 12-digit number',
} as const;
