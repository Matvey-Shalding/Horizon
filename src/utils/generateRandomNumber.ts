/**
 * Generates a random number of a specified length.
 * @param {number} length - The number of digits in the generated number.
 * @returns {number} A random number with the specified number of digits.
 * @throws {Error} If the length is not a positive integer.
 */
export function generateRandomNumber(length: number): number {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Length must be a positive integer.");
  }

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
