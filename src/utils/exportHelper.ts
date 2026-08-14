import { ITRProcessedData } from '../types/itr';
import { formatINR } from './formatters';
import { getCurrentTaxYear } from './dateHelper';

/**
 * Generates a Markdown report of the complete ITR-2 Field Guide
 */
export function generateMarkdownReport(data: ITRProcessedData): string {
  const { scheduleS, scheduleHP, scheduleCG, schedule112A, scheduleOS, scheduleVIA, taxSummary } = data;
  const taxYear = getCurrentTaxYear();

  let md = `# ITR-2 Copy-Ready Field Guide Report (${taxYear.fy} / ${taxYear.ay})\n\n`;
  md += `Generated on: ${new Date().toLocaleString('en-IN')}\n`;
  md += `Tax Regime: **${taxSummary.regime.toUpperCase()} REGIME**\n\n`;

  // ── TAX SUMMARY ──
  md += `## 📊 TAX COMPUTATION & REFUND SUMMARY\n\n`;
  md += `| Category | Amount |\n| :--- | :--- |\n`;
  md += `| Gross Total Income | ${formatINR(taxSummary.grossTotalIncome)} |\n`;
  md += `| Chapter VI-A Deductions | ${formatINR(taxSummary.totalDeductions)} |\n`;
  md += `| Total Taxable Income | ${formatINR(taxSummary.netTaxableIncome)} |\n`;
  md += `| Total Tax Liability (incl. Cess) | ${formatINR(taxSummary.totalTaxLiability)} |\n`;
  md += `| Total TDS Paid | ${formatINR(taxSummary.totalTdsPaid)} |\n`;
  md += `| **NET ${taxSummary.status}** | **${formatINR(taxSummary.netRefundOrPayable)}** |\n\n`;

  // ── SCHEDULE S ──
  if (scheduleS) {
    md += `## 🏢 TAB 1: SCHEDULE S (SALARY)\n\n`;
    md += `Employer: **${scheduleS.employerName}** (TAN: \`${scheduleS.employerTAN}\`)\n\n`;
    md += `| Portal Field | Extracted Value |\n| :--- | :--- |\n`;
    md += `| 1a. Salary u/s 17(1) | ${formatINR(scheduleS.salary17_1)} |\n`;
    md += `| 1b. Perquisites u/s 17(2) | ${formatINR(scheduleS.perquisites17_2)} |\n`;
    md += `| 1c. Profits in lieu of salary 17(3) | ${formatINR(scheduleS.profits17_3)} |\n`;
    md += `| **2. Total Gross Salary** | **${formatINR(scheduleS.totalGrossSalary)}** |\n`;
    md += `| 3. Allowances exempt u/s 10 | ${formatINR(scheduleS.exemptAllowances_s10)} |\n`;
    md += `| **4. Balance Salary** | **${formatINR(scheduleS.balanceSalary)}** |\n`;
    md += `| 5a. Standard Deduction 16(ia) | ${formatINR(scheduleS.standardDeduction)} |\n`;
    md += `| 5c. Professional Tax 16(iii) | ${formatINR(scheduleS.professionalTax)} |\n`;
    md += `| **7. Income under head Salaries** | **${formatINR(scheduleS.incomeFromSalary)}** |\n\n`;
  }

  // ── SCHEDULE HP ──
  if (scheduleHP) {
    md += `## 🏠 TAB 2: SCHEDULE HP (HOUSE PROPERTY)\n\n`;
    md += `Property Type: **${scheduleHP.propertyType === 'self_occupied' ? 'Self Occupied' : 'Let Out'}**\n\n`;
    md += `| Portal Field | Extracted Value |\n| :--- | :--- |\n`;
    md += `| Interest on Housing Loan u/s 24b | ${formatINR(scheduleHP.homeLoanInterest24b)} |\n`;
    md += `| Gross Annual Value (Rent) | ${formatINR(scheduleHP.grossRentalIncome)} |\n`;
    md += `| Municipal Taxes Paid | ${formatINR(scheduleHP.municipalTaxesPaid)} |\n`;
    md += `| **Income/Loss from House Property** | **${formatINR(scheduleHP.incomeFromHP)}** |\n\n`;
  }

  // ── SCHEDULE CG ──
  if (scheduleCG) {
    md += `## 📈 TAB 3: SCHEDULE CG (CAPITAL GAINS)\n\n`;
    md += `| Portal Field | Amount | Tax Rate |\n| :--- | :--- | :--- |\n`;
    md += `| Short-Term Capital Gains (111A) | ${formatINR(scheduleCG.stcg111A)} | Tax @ 20% |\n`;
    md += `| Long-Term Capital Gains (112A) | ${formatINR(scheduleCG.ltcg112A)} | Tax @ 12.5% |\n`;
    md += `| Section 112A Exemption | ${formatINR(scheduleCG.ltcgExemption)} | Tax-Free up to ₹1.25L |\n`;
    md += `| **Net Taxable LTCG** | **${formatINR(scheduleCG.ltcgTaxable)}** | |\n\n`;

    md += `### Quarterly Accrual Breakdown (Item E)\n\n`;
    md += `| Time Period | STCG (111A) | LTCG (112A) |\n| :--- | :--- | :--- |\n`;
    const labels = scheduleCG.quarterlyBreakdown.labels;
    labels.forEach((label, i) => {
      md += `| ${label} | ${formatINR(scheduleCG.quarterlyBreakdown.stcg[i] || 0)} | ${formatINR(scheduleCG.quarterlyBreakdown.ltcg[i] || 0)} |\n`;
    });
    md += `\n`;
  }

  // ── SCHEDULE OS ──
  if (scheduleOS) {
    md += `## 💰 TAB 4: SCHEDULE OS (OTHER SOURCES)\n\n`;
    md += `| Portal Field | Value |\n| :--- | :--- |\n`;
    md += `| 1a(i) Savings Bank Interest | ${formatINR(scheduleOS.savingsInterest)} |\n`;
    md += `| 1a(ii) Dividend Income | ${formatINR(scheduleOS.dividendIncome)} |\n`;
    md += `| 1a(iii) FD/RD Interest | ${formatINR(scheduleOS.fdRdInterest)} |\n`;
    md += `| **Total Income from Other Sources** | **${formatINR(scheduleOS.totalOtherSources)}** |\n\n`;
  }

  // ── SCHEDULE VI-A ──
  if (scheduleVIA) {
    md += `## 🛡️ TAB 5: SCHEDULE VI-A (DEDUCTIONS)\n\n`;
    md += `| Section | Amount | Status |\n| :--- | :--- | :--- |\n`;
    md += `| Section 80C | ${formatINR(scheduleVIA.s80C)} | ${taxSummary.regime === 'new' ? 'Not Allowed' : 'Eligible'} |\n`;
    md += `| Section 80CCD(1B) NPS Self | ${formatINR(scheduleVIA.s80CCD_1B)} | ${taxSummary.regime === 'new' ? 'Not Allowed' : 'Eligible'} |\n`;
    md += `| Section 80CCD(2) NPS Employer | ${formatINR(scheduleVIA.s80CCD_2)} | **Eligible (Both Regimes)** |\n`;
    md += `| Section 80D Health Insurance | ${formatINR(scheduleVIA.s80D)} | ${taxSummary.regime === 'new' ? 'Not Allowed' : 'Eligible'} |\n`;
    md += `| Section 80TTA Savings Interest | ${formatINR(scheduleVIA.s80TTA)} | ${taxSummary.regime === 'new' ? 'Not Allowed' : 'Eligible'} |\n\n`;
  }

  return md;
}

/**
 * Downloads text as a file in browser
 */
export function downloadFile(content: string, fileName: string, contentType: string) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
