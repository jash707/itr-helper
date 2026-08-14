import * as XLSX from 'xlsx';
import { GrowwParsedData, GrowwTrade } from '../types/itr';

/**
 * Parses Groww Capital Gains XLSX file.
 * @param file - The XLSX file object
 * @returns The parsed capital gains data
 */
export async function parseGrowwXLSX(file: File): Promise<GrowwParsedData> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

    const result: GrowwParsedData = {
      stcg: { trades: [], total: 0 },
      ltcg: { trades: [], total: 0 },
      dividends: [],
      totalDividend: 0
    };

    const sheetNames = workbook.SheetNames;

    const findColumn = (row: Record<string, any>, possibleNames: string[]): any => {
      const keys = Object.keys(row);
      for (const key of keys) {
        const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, ' ');
        if (possibleNames.some(name => normalizedKey.includes(name.toLowerCase()))) {
          return row[key];
        }
      }
      return undefined;
    };

    const parseDate = (val: any): string | null => {
      if (!val) return null;
      if (val instanceof Date) {
        return val.toISOString().split('T')[0];
      }
      if (typeof val === 'string') {
        const parts = val.split(/[-/]/);
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
          } else {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
      }
      if (typeof val === 'number') {
         const date = new Date((val - (25567 + 2)) * 86400 * 1000);
         return date.toISOString().split('T')[0];
      }
      return null;
    };

    for (const sheetName of sheetNames) {
      const lowerSheetName = sheetName.toLowerCase();
      const worksheet = workbook.Sheets[sheetName];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (lowerSheetName.includes('dividend')) {
        for (const row of rows) {
          const scrip = findColumn(row, ['stock name', 'scrip name', 'scheme name', 'company']);
          const dateStr = findColumn(row, ['date', 'dividend date', 'record date']);
          const amount = parseFloat(findColumn(row, ['amount', 'net dividend', 'dividend amount']));
          
          if (amount && !isNaN(amount)) {
            result.dividends.push({
              scrip: scrip || 'Unknown',
              date: parseDate(dateStr),
              amount: amount
            });
            result.totalDividend += amount;
          }
        }
        continue;
      }

      const isSTCGSheet = lowerSheetName.includes('stcg') || lowerSheetName.includes('short term');
      const isLTCGSheet = lowerSheetName.includes('ltcg') || lowerSheetName.includes('long term');
      const isEquityOrMF = lowerSheetName.includes('equity') || lowerSheetName.includes('mutual fund');

      if (isSTCGSheet || isLTCGSheet || isEquityOrMF) {
        for (const row of rows) {
          const scrip = findColumn(row, ['stock name', 'scrip name', 'scheme name']);
          if (!scrip) continue;

          const isin = findColumn(row, ['isin']);
          const qty = parseFloat(findColumn(row, ['quantity', 'qty', 'units']));
          const buyDate = parseDate(findColumn(row, ['buy date', 'purchase date']));
          const sellDate = parseDate(findColumn(row, ['sell date', 'sale date']));
          const buyValue = parseFloat(findColumn(row, ['buy value', 'purchase amount', 'purchase value']));
          const sellValue = parseFloat(findColumn(row, ['sell value', 'sale amount', 'sale value']));
          const pnl = parseFloat(findColumn(row, ['realized p&l', 'net gain', 'gain', 'profit', 'loss']));
          const fmv = parseFloat(findColumn(row, ['fmv as on 31st jan 2018', 'fmv'])) || 0;
          const term = findColumn(row, ['term', 'gain type', 'type']);

          if (isNaN(qty) || isNaN(buyValue) || isNaN(sellValue)) continue;

          const trade: GrowwTrade = {
            scrip: String(scrip),
            isin: isin ? String(isin) : '',
            qty,
            buyDate,
            sellDate,
            buyValue,
            sellValue,
            pnl: isNaN(pnl) ? (sellValue - buyValue) : pnl,
            fmv31Jan2018: fmv
          };

          let isLongTerm = isLTCGSheet;
          if (!isLongTerm && !isSTCGSheet) {
            if (term && typeof term === 'string') {
              isLongTerm = term.toLowerCase().includes('long term');
            } else if (buyDate && sellDate) {
              const bDate = new Date(buyDate);
              const sDate = new Date(sellDate);
              const diffTime = Math.abs(sDate.getTime() - bDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              isLongTerm = diffDays > 365;
            }
          }

          if (isLongTerm) {
            result.ltcg.trades.push(trade);
            result.ltcg.total += trade.pnl;
          } else {
            result.stcg.trades.push(trade);
            result.stcg.total += trade.pnl;
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error parsing Groww XLSX:', error);
    throw error;
  }
}
