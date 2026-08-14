export interface GrowwTrade {
  scrip: string;
  isin: string;
  qty: number;
  buyDate: string | null;
  sellDate: string | null;
  buyValue: number;
  sellValue: number;
  pnl: number;
  fmv31Jan2018?: number;
}

export interface GrowwDividend {
  scrip: string;
  date: string | null;
  amount: number;
}

export interface GrowwParsedData {
  stcg: {
    trades: GrowwTrade[];
    total: number;
  };
  ltcg: {
    trades: GrowwTrade[];
    total: number;
  };
  dividends: GrowwDividend[];
  totalDividend: number;
}

export interface InterestTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'savings' | 'fd' | 'rd';
}

export interface BankParsedData {
  savingsInterest: number;
  fdInterest: number;
  rdInterest: number;
  interestTransactions: InterestTransaction[];
  bankTds?: number;
}

export interface Form16Deductions {
  s80C: number;
  s80CCC: number;
  s80CCD_1: number;
  s80CCD_1B: number;
  s80CCD_2: number;
  s80D: number;
  s80E: number;
  s80G: number;
  s80TTA: number;
}

export interface Form16ParsedData {
  employerName: string;
  employerTAN: string;
  grossSalary17_1: number;
  perquisites17_2: number;
  profits17_3: number;
  totalGrossSalary: number;
  exemptAllowances_s10: number;
  balanceSalary: number;
  standardDeduction_16ia: number;
  entertainmentAllowance_16ii: number;
  professionalTax_16iii: number;
  totalDeductions_s16: number;
  incomeFromSalary: number;
  deductions: Form16Deductions;
  totalChapterVIA: number;
  tdsDeducted: number;
  regime: 'old' | 'new';
  homeLoanInterest_24b?: number;
}

export interface BroughtForwardLosses {
  stclPreviousYears: number;
  ltclPreviousYears: number;
}

export interface HousePropertyInputs {
  propertyType: 'self_occupied' | 'let_out';
  homeLoanInterest24b: number; // Interest on housing loan
  grossRentalIncome?: number;
  municipalTaxesPaid?: number;
}

export interface ScheduleHPData {
  propertyType: 'self_occupied' | 'let_out';
  homeLoanInterest24b: number;
  grossRentalIncome: number;
  municipalTaxesPaid: number;
  netAnnualValue: number;
  standardDeduction30Pct: number;
  incomeFromHP: number; // Can be negative (loss)
  eligibleLossSetOff: number; // Max 2L loss set-off against other heads under Old Regime
}

export interface ScheduleBFLAData {
  stcgGross: number;
  stclBroughtForward: number;
  stclSetOffAgainstStcg: number;
  stclSetOffAgainstLtcg: number;
  stcgNetTaxable: number;

  ltcgGross: number;
  ltclBroughtForward: number;
  ltclSetOffAgainstLtcg: number;
  ltcgExemption: number;
  ltcgNetTaxable: number;

  unabsorbedStclRemaining: number;
  unabsorbedLtclRemaining: number;
}

export interface ScheduleSData {
  salary17_1: number;
  perquisites17_2: number;
  profits17_3: number;
  totalGrossSalary: number;
  exemptAllowances_s10: number;
  balanceSalary: number;
  standardDeduction: number;
  entertainmentAllowance: number;
  professionalTax: number;
  totalDeductions_s16: number;
  incomeFromSalary: number;
  employerName: string;
  employerTAN: string;
  regime: 'old' | 'new';
}

export interface ScheduleCGBreakdown {
  labels: string[];
  stcg: number[];
  ltcg: number[];
}

export interface ScheduleCGData {
  stcg111A: number;
  ltcg112A: number;
  ltcgExemption: number;
  ltcgTaxable: number;
  quarterlyBreakdown: ScheduleCGBreakdown;
  bfla: ScheduleBFLAData;
}

export interface Schedule112AItem {
  isin: string;
  name: string;
  qty: number;
  saleValue: number;
  costOfAcquisition: number;
  fmv31Jan2018: number;
  adjustedCost: number;
  capitalGain: number;
}

export interface ScheduleOSDividendBreakdown {
  labels: string[];
  values: number[];
}

export interface ScheduleOSData {
  savingsInterest: number;
  dividendIncome: number;
  fdRdInterest: number;
  totalOtherSources: number;
  dividendQuarterly: ScheduleOSDividendBreakdown;
}

export interface ScheduleVIAData {
  s80C: number;
  s80CCC: number;
  s80CCD_1: number;
  s80CCD_1B: number;
  s80CCD_2: number;
  s80D: number;
  s80E: number;
  s80G: number;
  s80TTA: number;
  regime: 'old' | 'new';
}

export interface TaxCalculationSummary {
  grossTotalIncome: number;
  totalDeductions: number;
  netTaxableIncome: number;
  
  // Tax breakdown
  stcgTax20: number;
  ltcgTax12_5: number;
  slabTaxableIncome: number;
  slabTax: number;
  totalBasicTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  cess4Pct: number;
  totalTaxLiability: number;
  
  // Taxes Paid
  salaryTds: number;
  bankTds: number;
  totalTdsPaid: number;
  
  // Net Status
  netRefundOrPayable: number; // positive = refund, negative = payable
  status: 'REFUND' | 'PAYABLE' | 'NIL';
  regime: 'old' | 'new';
}

export interface SanityAlert {
  type: 'warning' | 'error' | 'info' | 'reminder';
  title: string;
  message: string;
}

export interface ITRProcessedData {
  scheduleS: ScheduleSData | null;
  scheduleHP: ScheduleHPData | null;
  scheduleCG: ScheduleCGData | null;
  schedule112A: Schedule112AItem[] | null;
  scheduleOS: ScheduleOSData | null;
  scheduleVIA: ScheduleVIAData | null;
  taxSummary: TaxCalculationSummary;
  alerts: SanityAlert[];
}

export interface RawParsedInputs {
  growwData: GrowwParsedData | null;
  bankData: BankParsedData | null;
  form16Data: Form16ParsedData | null;
  bfLosses?: BroughtForwardLosses;
  houseProperty?: HousePropertyInputs;
  overrideRegime?: 'old' | 'new';
}
