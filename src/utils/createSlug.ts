/**
 * Converts a string into a URL-friendly slug.
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with "-"
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

