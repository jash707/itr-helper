import * as pdfjsLib from 'pdfjs-dist';
import { Form16ParsedData } from '../types/itr';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

/**
 * Parses Form 16 Part B PDF.
 * @param file - The Form 16 PDF file
 * @returns Extracted Form 16 data
 */
export async function parseForm16(file: File): Promise<Form16ParsedData> {
  try {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const items = textContent.items.map((item: any) => item.str);
      fullText += items.join(' ') + ' ';
    }
    
    const extractAmount = (pattern: RegExp | string): number => {
      const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
      const match = fullText.match(regex);
      if (match && match[1]) {
        const val = parseFloat(match[1].replace(/,/g, ''));
        return isNaN(val) ? 0 : val;
      }
      return 0;
    };
    
    const result: Form16ParsedData = {
      employerName: 'Extracted Employer (Auto)',
      employerTAN: '',
      grossSalary17_1: extractAmount(/17\s*\(\s*1\s*\).*?([\d,]+\.\d{2}|[\d,]+)/),
      perquisites17_2: extractAmount(/17\s*\(\s*2\s*\).*?([\d,]+\.\d{2}|[\d,]+)/),
      profits17_3: extractAmount(/17\s*\(\s*3\s*\).*?([\d,]+\.\d{2}|[\d,]+)/),
      totalGrossSalary: 0,
      exemptAllowances_s10: extractAmount(/(?:section\s*10|exempt.*?10).*?([\d,]+\.\d{2}|[\d,]+)/),
      balanceSalary: 0,
      standardDeduction_16ia: extractAmount(/(?:16\s*\(\s*ia\s*\)|standard\s*deduction).*?([\d,]+\.\d{2}|[\d,]+)/),
      entertainmentAllowance_16ii: extractAmount(/16\s*\(\s*ii\s*\).*?([\d,]+\.\d{2}|[\d,]+)/),
      professionalTax_16iii: extractAmount(/(?:16\s*\(\s*iii\s*\)|professional\s*tax).*?([\d,]+\.\d{2}|[\d,]+)/),
      totalDeductions_s16: 0,
      incomeFromSalary: 0,
      deductions: {
        s80C: extractAmount(/80C\b.*?([\d,]+\.\d{2}|[\d,]+)/),
        s80CCC: extractAmount(/80CCC\b.*?([\d,]+\.\d{2}|[\d,]+)/),
        s80CCD_1: extractAmount(/80CCD\s*\(\s*1\s*\).*?([\d,]+\.\d{2}|[\d,]+)/),
        s80CCD_1B: extractAmount(/80CCD\s*\(\s*1B\s*\).*?([\d,]+\.\d{2}|[\d,]+)/),
        s80CCD_2: extractAmount(/80CCD\s*\(\s*2\s*\).*?([\d,]+\.\d{2}|[\d,]+)/),
        s80D: extractAmount(/80D\b.*?([\d,]+\.\d{2}|[\d,]+)/),
        s80E: extractAmount(/80E\b.*?([\d,]+\.\d{2}|[\d,]+)/),
        s80G: extractAmount(/80G\b.*?([\d,]+\.\d{2}|[\d,]+)/),
        s80TTA: extractAmount(/80TTA\b.*?([\d,]+\.\d{2}|[\d,]+)/)
      },
      totalChapterVIA: 0,
      tdsDeducted: extractAmount(/(?:tax\s*deducted|TDS).*?([\d,]+\.\d{2}|[\d,]+)/),
      regime: fullText.toLowerCase().includes('115bac') || fullText.toLowerCase().includes('new regime') ? 'new' : 'old'
    };

    result.totalGrossSalary = result.grossSalary17_1 + result.perquisites17_2 + result.profits17_3;
    result.balanceSalary = Math.max(0, result.totalGrossSalary - result.exemptAllowances_s10);
    result.totalDeductions_s16 = result.standardDeduction_16ia + result.entertainmentAllowance_16ii + result.professionalTax_16iii;
    result.incomeFromSalary = Math.max(0, result.balanceSalary - result.totalDeductions_s16);
    
    result.totalChapterVIA = Object.values(result.deductions).reduce((sum, val) => sum + val, 0);

    const tanMatch = fullText.match(/[A-Za-z]{4}\d{5}[A-Za-z]/);
    if (tanMatch) {
      result.employerTAN = tanMatch[0].toUpperCase();
    }
    
    return result;
  } catch (error) {
    console.error('Error parsing Form 16:', error);
    throw error;
  }
}
