import { GrowwParsedData, BankParsedData, Form16ParsedData } from '../types/itr';

export const sampleGrowwData: GrowwParsedData = {
  stcg: {
    trades: [
      { scrip: 'TATA MOTORS LTD', isin: 'INE155A01022', qty: 25, buyDate: '2025-11-10', sellDate: '2025-05-22', buyValue: 18750, sellValue: 22500, pnl: 3750 },
      { scrip: 'INFOSYS LTD', isin: 'INE009A01021', qty: 15, buyDate: '2025-03-01', sellDate: '2025-07-18', buyValue: 22050, sellValue: 24300, pnl: 2250 },
      { scrip: 'HDFC BANK LTD', isin: 'INE040A01034', qty: 10, buyDate: '2025-06-15', sellDate: '2025-08-28', buyValue: 16200, sellValue: 17800, pnl: 1600 },
      { scrip: 'RELIANCE INDUSTRIES', isin: 'INE002A01018', qty: 8, buyDate: '2025-09-05', sellDate: '2025-11-20', buyValue: 19680, sellValue: 21040, pnl: 1360 },
      { scrip: 'WIPRO LTD', isin: 'INE075A01022', qty: 40, buyDate: '2025-10-12', sellDate: '2025-12-25', buyValue: 17600, sellValue: 19200, pnl: 1600 },
      { scrip: 'BAJAJ FINANCE LTD', isin: 'INE296A01024', qty: 5, buyDate: '2026-01-08', sellDate: '2026-02-15', buyValue: 34250, sellValue: 36500, pnl: 2250 },
      { scrip: 'AXIS BANK LTD', isin: 'INE238A01034', qty: 20, buyDate: '2025-12-20', sellDate: '2026-03-10', buyValue: 21400, sellValue: 22800, pnl: 1400 },
      { scrip: 'ITC LTD', isin: 'INE154A01025', qty: 50, buyDate: '2026-02-01', sellDate: '2026-03-28', buyValue: 21500, sellValue: 22750, pnl: 1250 },
    ],
    total: 15460,
  },

  ltcg: {
    trades: [
      { scrip: 'TCS LTD', isin: 'INE467B01029', qty: 12, buyDate: '2023-04-15', sellDate: '2025-06-10', buyValue: 38400, sellValue: 48600, pnl: 10200, fmv31Jan2018: 0 },
      { scrip: 'ASIAN PAINTS LTD', isin: 'INE021A01026', qty: 8, buyDate: '2017-08-20', sellDate: '2025-09-12', buyValue: 8640, sellValue: 25600, pnl: 16960, fmv31Jan2018: 10240 },
      { scrip: 'HINDUSTAN UNILEVER', isin: 'INE030A01027', qty: 15, buyDate: '2024-01-05', sellDate: '2025-12-18', buyValue: 37500, sellValue: 42750, pnl: 5250, fmv31Jan2018: 0 },
      { scrip: 'KOTAK MAHINDRA BANK', isin: 'INE237A01028', qty: 10, buyDate: '2017-11-30', sellDate: '2026-01-22', buyValue: 10200, sellValue: 18500, pnl: 8300, fmv31Jan2018: 10800 },
    ],
    total: 40710,
  },

  dividends: [
    { scrip: 'TCS LTD', date: '2025-05-15', amount: 2700 },
    { scrip: 'INFOSYS LTD', date: '2025-06-20', amount: 1800 },
    { scrip: 'HDFC BANK LTD', date: '2025-09-10', amount: 950 },
    { scrip: 'ITC LTD', date: '2025-11-25', amount: 1500 },
    { scrip: 'RELIANCE INDUSTRIES', date: '2026-02-08', amount: 640 },
  ],
  totalDividend: 7590,
};

export const sampleBankData: BankParsedData = {
  savingsInterest: 8500,
  fdInterest: 25000,
  rdInterest: 0,
  bankTds: 2500, // 10% TDS on FD interest
  interestTransactions: [
    { date: '2025-06-30', description: 'SB INT CR Q1', amount: 2100, type: 'savings' },
    { date: '2025-09-30', description: 'SB INT CR Q2', amount: 2200, type: 'savings' },
    { date: '2025-12-31', description: 'SB INT CR Q3', amount: 2050, type: 'savings' },
    { date: '2026-03-31', description: 'SB INT CR Q4', amount: 2150, type: 'savings' },
    { date: '2025-09-15', description: 'FD INT CREDIT - FD001', amount: 12500, type: 'fd' },
    { date: '2026-03-15', description: 'FD INT CREDIT - FD001', amount: 12500, type: 'fd' },
  ],
};

export const sampleForm16Data: Form16ParsedData = {
  employerName: 'ACME TECHNOLOGIES PVT LTD',
  employerTAN: 'MUMA12345E',
  grossSalary17_1: 1200000,
  perquisites17_2: 0,
  profits17_3: 0,
  totalGrossSalary: 1200000,
  exemptAllowances_s10: 96000,
  balanceSalary: 1104000,
  standardDeduction_16ia: 75000,
  entertainmentAllowance_16ii: 0,
  professionalTax_16iii: 2400,
  totalDeductions_s16: 77400,
  incomeFromSalary: 1026600,
  homeLoanInterest_24b: 180000, // Home Loan interest
  deductions: {
    s80C: 150000,
    s80CCC: 0,
    s80CCD_1: 0,
    s80CCD_1B: 50000,
    s80CCD_2: 48000,
    s80D: 25000,
    s80E: 0,
    s80G: 0,
    s80TTA: 8500,
  },
  totalChapterVIA: 281500,
  tdsDeducted: 89000,
  regime: 'old',
};
