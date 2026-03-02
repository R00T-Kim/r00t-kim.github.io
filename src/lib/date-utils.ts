/**
 * Parse a Korean-style date string (e.g. "2024. 03." or "2024.03") into a
 * sortable numeric value.  Returns `year * 100 + month` so that dates can be
 * compared with simple arithmetic.
 */
export function parseDate(dateStr: string): number {
  const [y, m] = dateStr.replace(/\./g, "").trim().split(/\s+/).map(Number);
  return y * 100 + (m || 0);
}
