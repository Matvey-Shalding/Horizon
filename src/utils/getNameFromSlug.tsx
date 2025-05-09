import { Bank } from "@prisma/client";
import { createSlug } from "./createSlug";

/**
 * Finds and returns a Bank object by slug from a list of banks.
 * @param banks - List of banks to search through
 * @param slug - Slug to match against the bank's cardholder name
 * @returns The matching Bank object, or undefined if not found
 */
export function getBankFromSlug(banks: Bank[], slug: string): Bank | undefined {
  return banks.find((bank) => createSlug(bank.cardholderName) === slug);
}
