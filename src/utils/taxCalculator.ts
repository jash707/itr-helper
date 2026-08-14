import {
  GrowwTrade, GrowwDividend, ITRProcessedData, RawParsedInputs, SanityAlert, ScheduleBFLAData,
  ScheduleHPData, TaxCalculationSummary, HousePropertyInputs
} from '../types/itr';

interface DateBucket {
  label: string;
  from: string;
  to: string;
}

const DATE_BUCKETS: DateBucket[] = [
  { label: 'Apr 1 – Jun 15', from: '2025-04-01', to: '2025-06-15' },
  { label: 'Jun 16 – Sep 15', from: '2025-06-16', to: '2025-09-15' },
  { label: 'Sep 16 – Dec 15', from: '2025-09-16', to: '2025-12-15' },
  { label: 'Dec 16 – Mar 15', from: '2025-12-16', to: '2026-03-15' },
  { label: 'Mar 16 – Mar 31', from: '2026-03-16', to: '2026-03-31' },
];

function isDateInBucket(dateStr: string | null, bucket: DateBucket): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const from = new Date(bucket.from);
  const to = new Date(bucket.to);
  d.setHours(0, 0, 0, 0);
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);
  return d >= from && d <= to;
}

export function bucketByQuarter(items: Array<GrowwTrade | GrowwDividend>): number[] {
  const buckets = DATE_BUCKETS.map(() => 0);
  
  for (const item of items) {
    const date = 'sellDate' in item ? item.sellDate : item.date;
    const amount = 'pnl' in item ? item.pnl : item.amount;
    
    for (let i = 0; i < DATE_BUCKETS.length; i++) {
      if (isDateInBucket(date, DATE_BUCKETS[i])) {
        buckets[i] += (amount || 0);
        break;
      }
    }
  }
  
  return buckets;
}

export function getDateBucketLabels(): string[] {
  return DATE_BUCKETS.map(b => b.label);
}

export function calc80TTA(savingsInterest: number, regime: 'old' | 'new'): number {
  if (regime === 'new') return 0;
  return Math.min(savingsInterest || 0, 10000);
}

export function calc80C(totalInvestments: number): number {
  return Math.min(totalInvestments || 0, 150000);
}

export function calcLTCGExemption(totalLTCG: number): number {
  if (totalLTCG <= 0) return 0;
  return Math.min(totalLTCG, 125000);
}

export function calcTaxableLTCG(totalLTCG: number): number {
  if (totalLTCG <= 0) return 0;
  return Math.max(totalLTCG - 125000, 0);
}

export function calcCostOfAcquisition112A(buyValue: number, fmv31Jan2018: number | undefined, sellValue: number): number {
  if (!fmv31Jan2018 || fmv31Jan2018 === 0) {
    return buyValue;
  }
  const higherCost = Math.max(buyValue, fmv31Jan2018);
  return Math.min(higherCost, sellValue);
}

/**
 * Calculates brought forward loss adjustment (Schedule BFLA & Schedule CFL)
 */
export function calculateBFLA(
  stcgGross: number,
  ltcgGross: number,
  stclBroughtForward: number = 0,
  ltclBroughtForward: number = 0
): ScheduleBFLAData {
  const ltclSetOffAgainstLtcg = Math.min(Math.max(0, ltcgGross), ltclBroughtForward);
  const remainingLtcgAfterLtcl = Math.max(0, ltcgGross - ltclSetOffAgainstLtcg);
  const unabsorbedLtclRemaining = ltclBroughtForward - ltclSetOffAgainstLtcg;

  const stclSetOffAgainstStcg = Math.min(Math.max(0, stcgGross), stclBroughtForward);
  const stcgNetTaxable = Math.max(0, stcgGross - stclSetOffAgainstStcg);
  const remainingStcl = stclBroughtForward - stclSetOffAgainstStcg;

  const stclSetOffAgainstLtcg = Math.min(remainingLtcgAfterLtcl, remainingStcl);
  const unabsorbedStclRemaining = remainingStcl - stclSetOffAgainstLtcg;

  const ltcgAfterLossSetoff = Math.max(0, remainingLtcgAfterLtcl - stclSetOffAgainstLtcg);
  const ltcgExemption = Math.min(ltcgAfterLossSetoff, 125000);
  const ltcgNetTaxable = Math.max(0, ltcgAfterLossSetoff - 125000);

  return {
    stcgGross,
    stclBroughtForward,
    stclSetOffAgainstStcg,
    stclSetOffAgainstLtcg,
    stcgNetTaxable,

    ltcgGross,
    ltclBroughtForward,
    ltclSetOffAgainstLtcg,
    ltcgExemption,
    ltcgNetTaxable,

    unabsorbedStclRemaining,
    unabsorbedLtclRemaining,
  };
}

/**
 * Calculates Income/Loss from House Property (Schedule HP)
 */
export function calculateScheduleHP(hpInputs?: HousePropertyInputs, form16Interest24b?: number): ScheduleHPData | null {
  const interest24b = hpInputs?.homeLoanInterest24b || form16Interest24b || 0;
  const isLetOut = hpInputs?.propertyType === 'let_out';
  const grossRent = isLetOut ? (hpInputs?.grossRentalIncome || 0) : 0;
  const municipalTax = isLetOut ? (hpInputs?.municipalTaxesPaid || 0) : 0;

  if (interest24b === 0 && grossRent === 0) return null;

  const netAnnualValue = Math.max(0, grossRent - municipalTax);
  const stdDeduction30Pct = Math.round(netAnnualValue * 0.3);
  
  // Deduction u/s 24b is capped at 2L for self-occupied
  const cappedInterest24b = isLetOut ? interest24b : Math.min(interest24b, 200000);
  
  const incomeFromHP = netAnnualValue - stdDeduction30Pct - cappedInterest24b;
  // Loss set-off against other heads under Old Regime is capped at 2L
  const eligibleLossSetOff = incomeFromHP < 0 ? Math.min(Math.abs(incomeFromHP), 200000) : 0;

  return {
    propertyType: isLetOut ? 'let_out' : 'self_occupied',
    homeLoanInterest24b: cappedInterest24b,
    grossRentalIncome: grossRent,
    municipalTaxesPaid: municipalTax,
    netAnnualValue,
    standardDeduction30Pct: stdDeduction30Pct,
    incomeFromHP,
    eligibleLossSetOff,
  };
}

/**
 * Calculates Tax Slabs for FY 2025-26 (AY 2026-27)
 */
function calculateSlabTax(income: number, regime: 'old' | 'new'): number {
  if (income <= 0) return 0;

  if (regime === 'new') {
    // New Tax Regime Slabs (FY 2025-26)
    // 0 - 3L: Nil
    // 3L - 7L: 5%
    // 7L - 10L: 10%
    // 10L - 12L: 15%
    // 12L - 15L: 20%
    // > 15L: 30%
    let tax = 0;
    if (income > 1500000) {
      tax += (income - 1500000) * 0.3;
      income = 1500000;
    }
    if (income > 1200000) {
      tax += (income - 1200000) * 0.20;
      income = 1200000;
    }
    if (income > 1000000) {
      tax += (income - 1000000) * 0.15;
      income = 1000000;
    }
    if (income > 700000) {
      tax += (income - 700000) * 0.10;
      income = 700000;
    }
    if (income > 300000) {
      tax += (income - 300000) * 0.05;
    }
    return Math.round(tax);
  } else {
    // Old Tax Regime Slabs
    // 0 - 2.5L: Nil
    // 2.5L - 5L: 5%
    // 5L - 10L: 20%
    // > 10L: 30%
    let tax = 0;
    if (income > 1000000) {
      tax += (income - 1000000) * 0.3;
      income = 1000000;
    }
    if (income > 500000) {
      tax += (income - 500000) * 0.20;
      income = 500000;
    }
    if (income > 250000) {
      tax += (income - 250000) * 0.05;
    }
    return Math.round(tax);
  }
}

/**
 * Calculates Full Tax Computation Summary & Net Refund / Tax Payable
 */
export function calculateTaxSummary(
  salaryIncome: number,
  hpData: ScheduleHPData | null,
  bfla: ScheduleBFLAData,
  otherSourcesIncome: number,
  totalDeductions: number,
  salaryTds: number,
  bankTds: number,
  regime: 'old' | 'new'
): TaxCalculationSummary {
  // House Property Loss set-off against Salary/Other sources
  let hpLossSetoff = 0;
  if (hpData && hpData.incomeFromHP < 0) {
    // Allowed only in Old Regime, capped at 2L
    hpLossSetoff = regime === 'old' ? hpData.eligibleLossSetOff : 0;
  }

  // Gross Total Income (Excluding special rate CG)
  const regularIncome = Math.max(0, salaryIncome + otherSourcesIncome - hpLossSetoff);
  const grossTotalIncome = regularIncome + bfla.stcgNetTaxable + bfla.ltcgNetTaxable;

  // Chapter VI-A deductions apply to regular income
  const effectiveDeductions = regime === 'old' ? Math.min(regularIncome, totalDeductions) : Math.min(regularIncome, totalDeductions);
  const slabTaxableIncome = Math.max(0, regularIncome - effectiveDeductions);

  // 1. Slab Tax
  let slabTax = calculateSlabTax(slabTaxableIncome, regime);

  // 2. STCG Tax @ 20%
  const stcgTax20 = Math.round(bfla.stcgNetTaxable * 0.20);

  // 3. LTCG Tax @ 12.5%
  const ltcgTax12_5 = Math.round(bfla.ltcgNetTaxable * 0.125);

  let totalBasicTax = slabTax + stcgTax20 + ltcgTax12_5;

  // 4. Rebate u/s 87A
  let rebate87A = 0;
  if (regime === 'new' && slabTaxableIncome <= 700000) {
    rebate87A = Math.min(totalBasicTax, 25000);
  } else if (regime === 'old' && slabTaxableIncome <= 500000) {
    rebate87A = Math.min(totalBasicTax, 12500);
  }

  const taxAfterRebate = Math.max(0, totalBasicTax - rebate87A);

  // 5. Health & Education Cess @ 4%
  const cess4Pct = Math.round(taxAfterRebate * 0.04);
  const totalTaxLiability = taxAfterRebate + cess4Pct;

  // 6. Taxes Paid
  const totalTdsPaid = salaryTds + bankTds;

  // 7. Net Refund / Payable
  const diff = totalTdsPaid - totalTaxLiability;
  const netRefundOrPayable = Math.abs(diff);

  let status: 'REFUND' | 'PAYABLE' | 'NIL' = 'NIL';
  if (diff > 0) status = 'REFUND';
  else if (diff < 0) status = 'PAYABLE';

  return {
    grossTotalIncome,
    totalDeductions: effectiveDeductions,
    netTaxableIncome: slabTaxableIncome + bfla.stcgNetTaxable + bfla.ltcgNetTaxable,
    stcgTax20,
    ltcgTax12_5,
    slabTaxableIncome,
    slabTax,
    totalBasicTax,
    rebate87A,
    taxAfterRebate,
    cess4Pct,
    totalTaxLiability,
    salaryTds,
    bankTds,
    totalTdsPaid,
    netRefundOrPayable,
    status,
    regime,
  };
}

export function processITRData({ growwData, bankData, form16Data, bfLosses, houseProperty, overrideRegime }: RawParsedInputs): ITRProcessedData {
  const alerts: SanityAlert[] = [];

  // ── Schedule S (Salary) ──
  const scheduleS = form16Data ? {
    salary17_1: form16Data.grossSalary17_1 || 0,
    perquisites17_2: form16Data.perquisites17_2 || 0,
    profits17_3: form16Data.profits17_3 || 0,
    totalGrossSalary: form16Data.totalGrossSalary || 0,
    exemptAllowances_s10: form16Data.exemptAllowances_s10 || 0,
    balanceSalary: form16Data.balanceSalary || 0,
    standardDeduction: form16Data.standardDeduction_16ia || 0,
    entertainmentAllowance: form16Data.entertainmentAllowance_16ii || 0,
    professionalTax: form16Data.professionalTax_16iii || 0,
    totalDeductions_s16: form16Data.totalDeductions_s16 || 0,
    incomeFromSalary: form16Data.incomeFromSalary || 0,
    employerName: form16Data.employerName || '',
    employerTAN: form16Data.employerTAN || '',
    regime: form16Data.regime || 'new',
  } : null;

  // ── Schedule HP (House Property) ──
  const scheduleHP = calculateScheduleHP(houseProperty, form16Data?.homeLoanInterest_24b);

  // ── Schedule CG (Capital Gains) ──
  const stcgGross = growwData?.stcg?.total || 0;
  const ltcgGross = growwData?.ltcg?.total || 0;
  const stclBF = bfLosses?.stclPreviousYears || 0;
  const ltclBF = bfLosses?.ltclPreviousYears || 0;

  const bfla = calculateBFLA(stcgGross, ltcgGross, stclBF, ltclBF);

  const scheduleCG = growwData ? {
    stcg111A: stcgGross,
    ltcg112A: ltcgGross,
    ltcgExemption: bfla.ltcgExemption,
    ltcgTaxable: bfla.ltcgNetTaxable,
    quarterlyBreakdown: {
      labels: getDateBucketLabels(),
      stcg: bucketByQuarter(growwData.stcg?.trades || []),
      ltcg: bucketByQuarter(growwData.ltcg?.trades || []),
    },
    bfla,
  } : null;

  // ── Schedule 112A (ISIN-level LTCG) ──
  const schedule112A = (growwData?.ltcg?.trades?.length) ? growwData.ltcg.trades.map(t => ({
    isin: t.isin,
    name: t.scrip,
    qty: t.qty,
    saleValue: t.sellValue || (t.buyValue + t.pnl),
    costOfAcquisition: t.buyValue,
    fmv31Jan2018: t.fmv31Jan2018 || 0,
    adjustedCost: calcCostOfAcquisition112A(
      t.buyValue,
      t.fmv31Jan2018,
      t.sellValue || (t.buyValue + t.pnl)
    ),
    capitalGain: t.pnl,
  })) : null;

  // ── Schedule OS (Other Sources) ──
  const savingsInterest = bankData?.savingsInterest || 0;
  const fdInterest = (bankData?.fdInterest || 0) + (bankData?.rdInterest || 0);
  const totalDividend = growwData?.totalDividend || 0;

  const scheduleOS = {
    savingsInterest,
    dividendIncome: totalDividend,
    fdRdInterest: fdInterest,
    totalOtherSources: savingsInterest + fdInterest + totalDividend,
    dividendQuarterly: {
      labels: getDateBucketLabels(),
      values: bucketByQuarter(growwData?.dividends || []),
    },
  };

  // ── Schedule VI-A (Deductions) ──
  const regime = overrideRegime || form16Data?.regime || 'new';
  const deductions = form16Data?.deductions || {
    s80C: 0, s80CCC: 0, s80CCD_1: 0, s80CCD_1B: 0, s80CCD_2: 0, s80D: 0, s80E: 0, s80G: 0, s80TTA: 0
  };

  const s80TTAVal = calc80TTA(savingsInterest, regime);

  const scheduleVIA = {
    s80C: calc80C(deductions.s80C || 0),
    s80CCC: deductions.s80CCC || 0,
    s80CCD_1: deductions.s80CCD_1 || 0,
    s80CCD_1B: Math.min(deductions.s80CCD_1B || 0, 50000),
    s80CCD_2: deductions.s80CCD_2 || 0,
    s80D: deductions.s80D || 0,
    s80E: deductions.s80E || 0,
    s80G: deductions.s80G || 0,
    s80TTA: s80TTAVal,
    regime,
  };

  const totalDeductionVal = regime === 'new' 
    ? scheduleVIA.s80CCD_2 
    : (scheduleVIA.s80C + scheduleVIA.s80CCD_1B + scheduleVIA.s80CCD_2 + scheduleVIA.s80D + s80TTAVal + scheduleVIA.s80E + scheduleVIA.s80G);

  // ── Tax Summary & Refund Computation ──
  const salaryInc = scheduleS?.incomeFromSalary || 0;
  const salaryTds = form16Data?.tdsDeducted || 0;
  const bankTds = bankData?.bankTds || 0;

  const taxSummary = calculateTaxSummary(
    salaryInc,
    scheduleHP,
    bfla,
    scheduleOS.totalOtherSources,
    totalDeductionVal,
    salaryTds,
    bankTds,
    regime
  );

  // ── Sanity Alerts ──
  if (regime === 'new') {
    alerts.push({
      type: 'warning',
      title: 'New Tax Regime Selected',
      message: 'Under the New Tax Regime (default for FY 2025-26), Section 80TTA and Chapter VI-A deductions (80C, 80D, 80CCD(1B)) are NOT available. Only Section 80CCD(2) NPS Employer contribution and Standard Deduction (₹75k) are allowed.',
    });
  }

  if (scheduleHP && scheduleHP.incomeFromHP < 0 && regime === 'new') {
    alerts.push({
      type: 'warning',
      title: 'House Property Loss Disallowed under New Regime',
      message: `You have a Home Loan Interest loss of ₹${Math.abs(scheduleHP.incomeFromHP).toLocaleString('en-IN')}. Under the New Tax Regime, house property loss cannot be set off against Salary or Other Income.`,
    });
  }

  if (stclBF > 0 || ltclBF > 0) {
    alerts.push({
      type: 'info',
      title: 'Schedule CFL / BFLA Loss Set-Off Applied',
      message: `Brought forward losses (STCL: ₹${stclBF.toLocaleString('en-IN')}, LTCL: ₹${ltclBF.toLocaleString('en-IN')}) have been set off against current year capital gains in Schedule CG. Unabsorbed losses will be carried forward to AY 2027-28.`,
    });
  }

  if (!form16Data) {
    alerts.push({
      type: 'info',
      title: 'Form 16 Not Uploaded',
      message: 'Schedule S (Salary) and Schedule VI-A (Deductions) data is incomplete. Upload Form 16 Part B for complete salary and deduction details.',
    });
  }

  if (!growwData) {
    alerts.push({
      type: 'info',
      title: 'Groww Report Not Uploaded',
      message: 'Schedule CG (Capital Gains), Schedule 112A, and Dividend data is missing. Upload your Groww Capital Gains report.',
    });
  }

  if (!bankData) {
    alerts.push({
      type: 'info',
      title: 'Bank Statement Not Uploaded',
      message: 'Savings bank interest and FD/RD interest data is missing. Upload your bank statement or interest certificate.',
    });
  }

  if (form16Data && !form16Data.employerTAN) {
    alerts.push({
      type: 'error',
      title: 'Missing Employer TAN',
      message: 'Employer TAN number is required for ITR-2 filing. Check your Form 16 or contact your employer.',
    });
  }

  alerts.push({
    type: 'reminder',
    title: 'AIS / 26AS Cross-Verification',
    message: 'Before final submission, cross-check ALL values against your Annual Information Statement (AIS) and Form 26AS on the incometax.gov.in portal. Verify total TDS, savings interest, dividend income, and capital gains match.',
  });

  return {
    scheduleS,
    scheduleHP,
    scheduleCG,
    schedule112A,
    scheduleOS,
    scheduleVIA,
    taxSummary,
    alerts,
  };
}
