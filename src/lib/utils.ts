/**
 * Format an ISO date string (YYYY-MM-DD) to a readable "Mon YYYY" label.
 * e.g. "2025-06-01" → "Jun 2025"
 */
export function formatMonthYear(dateStr: string): string {
  if (!dateStr) return dateStr;
  const [year, month] = dateStr.split("-").map(Number);
  if (!year || !month) return dateStr;
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Format an ISO date string to a full readable date.
 * e.g. "2025-06-01" → "Jun 1, 2025"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return dateStr;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
