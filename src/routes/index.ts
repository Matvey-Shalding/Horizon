/** @constant Main application routes */
export const MAIN_ROUTES = {
  /** Home page route */
  HOME: '/main/home',
  /** Banks management route */
  BANKS: '/main/banks',
  /** Transactions overview route */
  TRANSACTIONS: '/main/transactions',
  /** Fund transfer route */
  TRANSFER: '/main/transfer',
  /** Bank connection route */
  CONNECT_BANK: '/main/connect-bank',
} as const;

/** @constant Authentication routes */
export const AUTH_ROUTES = {
  /** Login page route */
  LOGIN: '/auth/log-in',
  /** Sign-up page route */
  SIGN_UP: '/auth/sign-up',
} as const;
