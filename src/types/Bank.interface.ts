import { Category } from "./Category.interface";
import { Transaction } from "./Transaction.interface";

/**
 * Represents a bank card with essential details, balance,
 * transaction history, and budget management.
 */
export interface Bank {
  /**
   * A unique identifier for the bank card.
   */
  cardId: string;

  /**
   * The name of the cardholder.
   */
  cardholderName: string;

  /**
   * The current balance available on the card.
   */
  balance: string;

  /**
   * The monthly budget limit set for the card.
   */
  monthlyBudget: string;

  /**
   * The CVV (Card Verification Value) used for security purposes.
   */
  cardCvv: string;

  /**
   * A list of spending categories associated with the card.
   */
  categories: Category[];

  /**
   * A history of transactions made with the card.
   */
  transactions: Transaction[];

  /**
   * The total expenses recorded for the card.
   */
  expenses: {
    [key: string]: string;
  };
}
