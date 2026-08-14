export interface TaxYearInfo {
  fy: string;          // e.g., "FY 2025-26"
  ay: string;          // e.g., "AY 2026-27"
  fyCode: string;      // e.g., "2025-26"
  ayCode: string;      // e.g., "2026-27"
  fyStartYear: number; // e.g., 2025
  fyEndYear: number;   // e.g., 2026
  ayStartYear: number; // e.g., 2026
  ayEndYear: number;   // e.g., 2027
}

/**
 * Computes Indian Financial Year (FY) and Assessment Year (AY) dynamically based on calendar date.
 * Financial Year in India runs from April 1 to March 31.
 */
export function getCurrentTaxYear(date: Date = new Date()): TaxYearInfo {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan, 3 = Apr

  const fyStartYear = month < 3 ? year - 2 : year - 1;
  const fyEndYear = fyStartYear + 1;
  const ayStartYear = fyEndYear;
  const ayEndYear = ayStartYear + 1;

  const fyShort = fyEndYear.toString().slice(-2);
  const ayShort = ayEndYear.toString().slice(-2);

  return {
    fy: `FY ${fyStartYear}-${fyShort}`,
    ay: `AY ${ayStartYear}-${ayShort}`,
    fyCode: `${fyStartYear}-${fyShort}`,
    ayCode: `${ayStartYear}-${ayShort}`,
    fyStartYear,
    fyEndYear,
    ayStartYear,
    ayEndYear,
  };
}
