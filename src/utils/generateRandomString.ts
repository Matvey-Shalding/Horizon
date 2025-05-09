/**
 * Generates a random alphanumeric string of the specified length.
 *
 * @param {number} length - The length of the generated string.
 * @returns {string} A randomly generated alphanumeric string.
 */
export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length)),
  ).join("");
};
