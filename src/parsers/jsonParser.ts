import { BroughtForwardLosses } from '../types/itr';

/**
 * Parses previous year's ITR JSON file downloaded from incometax.gov.in (AY 2024-25 / AY 2025-26)
 * Extracts brought forward STCL and LTCL from Schedule CFL / LossCFSummary.
 */
export async function parsePreviousYearITRJson(file: File): Promise<BroughtForwardLosses> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    let totalStcl = 0;
    let totalLtcl = 0;

    // Helper to recursively sum numeric values for specific key patterns
    const sumKeys = (obj: any, keys: string[]): number => {
      if (!obj || typeof obj !== 'object') return 0;
      let sum = 0;
      
      if (Array.isArray(obj)) {
        for (const item of obj) {
          sum += sumKeys(item, keys);
        }
        return sum;
      }

      for (const key of Object.keys(obj)) {
        const lowerKey = key.toLowerCase();
        const isMatch = keys.some(k => lowerKey.includes(k.toLowerCase()));
        const val = obj[key];

        if (isMatch && (typeof val === 'number' || typeof val === 'string')) {
          const num = parseFloat(String(val));
          if (!isNaN(num) && num > 0) {
            sum += num;
          }
        } else if (val && typeof val === 'object') {
          sum += sumKeys(val, keys);
        }
      }
      return sum;
    };

    // Locate Schedule CFL in standard Income Tax Department JSON structures
    const itrRoot = data?.ITR || data?.ITRForm || data?.Form_ITR2 || data?.Form_ITR3 || data;
    const itrForm = itrRoot?.ITR2 || itrRoot?.ITR3 || itrRoot?.ITR4 || itrRoot;
    const scheduleCFL = itrForm?.ScheduleCFL || data?.ScheduleCFL || itrForm;

    // First attempt: check for summary fields in ScheduleCFL
    const stclKeys = ['totalstcl', 'stcl111a', 'stclother', 'stcl_111a', 'stcl_other', 'lossstc'];
    const ltclKeys = ['totalltcl', 'ltcl112a', 'ltcl112', 'ltcl_112a', 'ltcl_other', 'lossltc'];

    // Try summary object
    const summaryObj = scheduleCFL?.LossCFSummary || scheduleCFL?.LossSummary || scheduleCFL;

    totalStcl = sumKeys(summaryObj, stclKeys);
    totalLtcl = sumKeys(summaryObj, ltclKeys);

    // Second attempt: if summary yields 0, parse year-wise row items array if present
    if (totalStcl === 0 && totalLtcl === 0) {
      const yearWiseRows = scheduleCFL?.LossesCarriedForward || scheduleCFL?.CurrYrLossesSetOff || scheduleCFL?.LossCFDetail;
      if (Array.isArray(yearWiseRows)) {
        for (const row of yearWiseRows) {
          totalStcl += sumKeys(row, ['stcl', 'shortterm']);
          totalLtcl += sumKeys(row, ['ltcl', 'longterm']);
        }
      }
    }

    console.log('Parsed Previous Year Losses from ITR JSON:', { totalStcl, totalLtcl });

    return {
      stclPreviousYears: Math.round(totalStcl),
      ltclPreviousYears: Math.round(totalLtcl),
    };
  } catch (error) {
    console.error('Error parsing previous year ITR JSON:', error);
    return { stclPreviousYears: 0, ltclPreviousYears: 0 };
  }
}
