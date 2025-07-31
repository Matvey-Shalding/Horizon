/**
 * Converts a hex color code to an RGBA string with the given opacity.
 *
 * @param {string} hex - The hex color code, e.g., "#ff5733" or "#ff5733ff".
 * @param {number} opacity - The opacity value (from 0 to 1), where 0 is fully transparent and 1 is fully opaque.
 * @returns {string} The RGBA color string, e.g., "rgba(255, 87, 51, 0.5)".
 * @throws {Error} Throws an error if the hex code is invalid or opacity is out of range.
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  // Validate hex input format
  if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)) {
    throw new Error('Invalid hex color code');
  }

  // Remove the '#' from the hex string
  hex = hex.slice(1);

  // If hex is 3 characters long, expand it to 6 characters (e.g., "#fff" -> "#ffffff")
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  // Convert hex to RGB values
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Ensure opacity is a valid number between 0 and 1
  if (opacity < 0 || opacity > 1) {
    throw new Error('Opacity must be between 0 and 1');
  }

  // Return RGBA string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
