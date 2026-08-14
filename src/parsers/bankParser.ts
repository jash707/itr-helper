import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import { BankParsedData, InterestTransaction } from '../types/itr';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

/**
 * Parses Bank Statement (PDF, XLSX, CSV).
 * @param file - The statement file
 * @returns Parsed interest data
 */
export async function parseBankStatement(file: File): Promise<BankParsedData> {
  try {
    const fileName = file.name.toLowerCase();
    const result: BankParsedData = {
      savingsInterest: 0,
      fdInterest: 0,
      rdInterest: 0,
      interestTransactions: []
    };

    const processTransactions = (data: Array<{ date?: string; description?: string; credit?: any; amount?: any }>) => {
      const savingsRegex = /\b(SB\s*INT|SAVINGS?\s*INT|CREDIT\s*INT|INT\s*CR|INTEREST\s*(ON\s*)?SAVING)\b/i;
      const fdRegex = /\b(FD\s*INT|FIXED\s*DEPOSIT\s*INT|TDR\s*INT)\b/i;
      const rdRegex = /\b(RD\s*INT|RECURRING\s*DEPOSIT\s*INT)\b/i;

      for (const row of data) {
        const desc = (row.description || '').toString();
        let amountVal = row.credit !== undefined && row.credit !== 0 ? row.credit : row.amount;
        let amount = typeof amountVal === 'string' ? parseFloat(amountVal.replace(/,/g, '')) : parseFloat(amountVal);
        
        if (isNaN(amount) || amount <= 0) continue;

        let type: 'savings' | 'fd' | 'rd' | null = null;
        if (savingsRegex.test(desc)) type = 'savings';
        else if (fdRegex.test(desc)) type = 'fd';
        else if (rdRegex.test(desc)) type = 'rd';

        if (type) {
          const txn: InterestTransaction = {
            date: row.date || '',
            description: desc,
            amount: amount,
            type: type
          };
          result.interestTransactions.push(txn);
          
          if (type === 'savings') result.savingsInterest += amount;
          else if (type === 'fd') result.fdInterest += amount;
          else if (type === 'rd') result.rdInterest += amount;
        }
      }
    };

    if (fileName.endsWith('.csv')) {
      const text = await file.text();
      const parsed = Papa.parse<Record<string, any>>(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
      
      const mappedData = parsed.data.map(row => {
        const keys = Object.keys(row);
        const findKey = (keywords: string[]) => keys.find(k => keywords.some(kw => k.toLowerCase().includes(kw)));
        
        const descKey = findKey(['description', 'narration', 'particulars', 'details']);
        const creditKey = findKey(['credit', 'deposit', 'cr']);
        const amountKey = findKey(['amount']);
        const dateKey = findKey(['date', 'txn date']);
        
        return {
          date: dateKey ? String(row[dateKey]) : '',
          description: descKey ? String(row[descKey]) : '',
          credit: creditKey ? row[creditKey] : (amountKey ? row[amountKey] : 0)
        };
      });
      processTransactions(mappedData);
    } 
    else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
      
      const mappedData = rows.map(row => {
        const keys = Object.keys(row);
        const findKey = (keywords: string[]) => keys.find(k => keywords.some(kw => k.toLowerCase().includes(kw)));
        
        const descKey = findKey(['description', 'narration', 'particulars', 'details']);
        const creditKey = findKey(['credit', 'deposit', 'cr']);
        const amountKey = findKey(['amount']);
        const dateKey = findKey(['date', 'txn date']);
        
        return {
          date: dateKey ? String(row[dateKey]) : '',
          description: descKey ? String(row[descKey]) : '',
          credit: creditKey ? row[creditKey] : (amountKey ? row[amountKey] : 0)
        };
      });
      processTransactions(mappedData);
    }
    else if (fileName.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      
      const savingsRegex = /\b(SB\s*INT|SAVINGS?\s*INT|CREDIT\s*INT|INT\s*CR|INTEREST\s*(ON\s*)?SAVING)\b/i;
      const fdRegex = /\b(FD\s*INT|FIXED\s*DEPOSIT\s*INT|TDR\s*INT)\b/i;
      const rdRegex = /\b(RD\s*INT|RECURRING\s*DEPOSIT\s*INT)\b/i;
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items.map((item: any) => item.str);
        const text = items.join(' ');
        
        const extractInterest = (regex: RegExp, type: 'savings' | 'fd' | 'rd') => {
          let match: RegExpExecArray | null;
          const globalRegex = new RegExp(regex.source, 'gi');
          while ((match = globalRegex.exec(text)) !== null) {
            const snippet = text.substring(match.index, match.index + 100);
            const numMatch = snippet.match(/\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\b/g);
            if (numMatch) {
              const amounts = numMatch.map(n => parseFloat(n.replace(/,/g, '')));
              const validAmount = amounts.find(a => a > 0);
              if (validAmount) {
                 result.interestTransactions.push({
                   date: '',
                   description: match[0],
                   amount: validAmount,
                   type: type
                 });
                 if (type === 'savings') result.savingsInterest += validAmount;
                 else if (type === 'fd') result.fdInterest += validAmount;
                 else if (type === 'rd') result.rdInterest += validAmount;
              }
            }
          }
        };
        
        extractInterest(savingsRegex, 'savings');
        extractInterest(fdRegex, 'fd');
        extractInterest(rdRegex, 'rd');
      }
    }

    return result;
  } catch (error) {
    console.error('Error parsing bank statement:', error);
    throw error;
  }
}
