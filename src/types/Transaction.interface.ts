/**
 * Possible statuses of a transaction.
 */
export type TransactionStatus = "PROCESSING" | "SUCCESS" | "DECLINED";

/**
 * Represents a financial transaction.
 */
export interface Transaction {
  /**
   * Unique identifier of the transaction.
   */
  transaction: string;

  /**
   * The monetary amount of the transaction.
   */
  amount: string;

  /**
   * The current status of the transaction.
   */
  status: TransactionStatus;

  /**
   * The date of the transaction in ISO string format.
   */
  date: string;

  /**
   * The category associated with the transaction.
   */
  category?: string;

  message?: string;
}
