/**
 * Formats a numeric string with commas for thousands separators.
 * Preserves cursor position during formatting.
 *
 * Decimals are preserved: asset amounts are routinely fractional (0.0125 BTC,
 * 12.5 USDT), and stripping the decimal point silently multiplied the value by
 * a power of ten (0.0125 → 125).
 *
 * @param value - The raw input string (e.g., "10000.5")
 * @param cursorPosition - Current cursor position in the input
 * @param maxDecimals - Precision cap for the fractional part (default 8)
 * @returns Object with formatted value and new cursor position
 */
export function formatWithCommas(
  value: string,
  cursorPosition: number,
  maxDecimals = 8,
): { formatted: string; newCursor: number } {
  const raw = value.replace(/[^0-9.]/g, '');
  const firstDot = raw.indexOf('.');
  const hasDot = firstDot !== -1;

  // Integer part: strip redundant leading zeros ("007" → "7", "0" stays "0").
  let intPart = hasDot ? raw.slice(0, firstDot) : raw;
  intPart = intPart.replace(/^0+(?=\d)/, '') || '0';

  // Fractional part: only the first dot counts, digits only, capped precision.
  const decPart = hasDot
    ? raw.slice(firstDot + 1).replace(/[^0-9]/g, '').slice(0, maxDecimals)
    : '';

  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = hasDot ? `${grouped}.${decPart}` : grouped;

  // Map the caret across the reformatting: count digit/dot characters before it
  // in the raw input, then walk the formatted string to the same position.
  const significant = (value.slice(0, cursorPosition).match(/[0-9.]/g) || []).length;
  let newCursor = formatted.length;
  if (significant === 0) {
    newCursor = 0;
  } else {
    let consumed = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/[0-9.]/.test(formatted[i])) {
        consumed++;
        if (consumed === significant) {
          newCursor = i + 1;
          break;
        }
      }
    }
  }

  return { formatted, newCursor };
}

/**
 * Removes commas and any other formatting characters from the string, keeping
 * the decimal point, so `parseFloat` sees the amount the user typed.
 * @param value - The formatted string (e.g., "10,000.50")
 * @returns Unformatted numeric string (e.g., "10000.50")
 */
export function unformat(value: string): string {
  const cleaned = String(value ?? '').replace(/[^0-9.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot === -1) return cleaned;
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
}
