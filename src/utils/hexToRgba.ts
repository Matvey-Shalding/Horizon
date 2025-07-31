const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/;

/**
 * Converts a hex color code to an RGBA string with the given opacity.
 *
 * @param {string} hex - The hex color code (e.g., "#ff5733" or "#fff").
 * @param {number} opacity - A value from 0 to 1 indicating transparency.
 * @returns {string} The corresponding RGBA color string.
 * @throws {Error} If the hex code is invalid or opacity is out of range.
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  if (!HEX_COLOR_REGEX.test(hex)) {
    throw new Error('Invalid hex color code');
  }

  hex = hex.slice(1);

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  if (opacity < 0 || opacity > 1) {
    throw new Error('Opacity must be between 0 and 1');
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
