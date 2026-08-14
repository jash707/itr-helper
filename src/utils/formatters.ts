/**
 * Format a number in Indian currency style: ₹1,23,456
 */
export function formatINR(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  const rounded = Math.round(num);
  return '₹' + rounded.toLocaleString('en-IN');
}

/**
 * Format a number in Indian style without currency symbol
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return '0';
  const parsed = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(parsed)) return '0';
  return Number(parsed).toLocaleString('en-IN');
}

/**
 * Format a raw number for copy-paste (no symbol, no commas)
 */
export function formatForCopy(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '0';
  if (typeof amount === 'string' && isNaN(Number(amount))) return amount;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  return String(Math.round(num));
}

/**
 * Format date to DD/MM/YYYY
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format date to readable: 15 May 2025
 */
export function formatDateReadable(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Parse a date string and return a Date object
 */
export function parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
  }
  return new Date(dateStr);
}
