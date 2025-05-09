/**
 * Returns a shortened version of the input string.
 * - If the string has more than two words, returns the first letters of the first two words.
 * - Otherwise, returns the first two letters of the original string.
 *
 * @param {string} input - The input string to process.
 * @returns {string} - The shortened string based on the given conditions.
 */
export function shortenString(input: string): string {
  const words = input.trim().split(/\s+/); // Split by spaces, handling multiple spaces

  if (words.length > 2) {
    return words[0][0] + words[1][0]; // First letters of first two words
  } else {
    return input.slice(0, 2); // First two letters of the original string
  }
}
