const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;

const TRIM_DASHES_REGEX = /^-+|-+$/g;

/**
 * Converts a string into a URL-friendly slug.
 *
 * @param {string} name - The input string to convert.
 * @returns {string} URL-friendly slug.
 */
export function createSlug(name: string): string {
  return name.toLowerCase().trim().replace(NON_ALPHANUMERIC_REGEX, '-').replace(TRIM_DASHES_REGEX, '');
}
