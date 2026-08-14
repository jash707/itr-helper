import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import { Download, FileDownload, CheckCircle, Warning, HelpOutlined } from '@mui/icons-material';
import CopyableField from '../components/CopyableField';
import { ITRProcessedData } from '../types/itr';
import { generateMarkdownReport, downloadFile } from '../utils/exportHelper';
import { getCurrentTaxYear } from '../utils/dateHelper';

interface TaxSummaryProps {
  data: ITRProcessedData;
  onRegimeChange?: (newRegime: 'old' | 'new') => void;
}

const TaxSummary: React.FC<TaxSummaryProps> = ({ data, onRegimeChange }) => {
  const { taxSummary } = data;
  const taxYear = getCurrentTaxYear();
  const isRefund = taxSummary.status === 'REFUND';
  const isPayable = taxSummary.status === 'PAYABLE';

  const tableHeaderStyle = {
    backgroundColor: '#faf8f5',
    textTransform: 'uppercase' as const,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    color: '#71717a'
  };

  const cellStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.875rem',
    borderBottom: '1px solid rgba(26,26,26,0.06)',
    padding: '12px 16px'
  };

  const titleCellStyle = {
    ...cellStyle,
    fontWeight: 600,
    color: '#1a1a1a'
  };

  const handleExportMarkdown = () => {
    const md = generateMarkdownReport(data);
    downloadFile(md, `ITR2_Field_Guide_${taxYear.fyCode}.md`, 'text/markdown');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    downloadFile(jsonStr, `ITR2_Computed_Data_${taxYear.fyCode}.json`, 'application/json');
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header & Regime Switcher Control */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
          Tax Computation & Summary
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, backgroundColor: '#ffffff', p: 0.5, borderRadius: '6px', border: '1px solid rgba(26,26,26,0.1)' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, px: 1, color: '#71717a', fontSize: '0.7rem', fontFamily: '"JetBrains Mono", monospace' }}>
            REGIME:
          </Typography>
          <Button
            size="small"
            onClick={() => onRegimeChange?.('new')}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '4px',
              backgroundColor: taxSummary.regime === 'new' ? '#121212' : 'transparent',
              color: taxSummary.regime === 'new' ? '#ffffff' : '#71717a',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: taxSummary.regime === 'new' ? '#2a2a2a' : 'rgba(0,0,0,0.05)',
              },
              py: 0.25,
              px: 1.5,
            }}
          >
            New Regime (Default)
          </Button>
          <Button
            size="small"
            onClick={() => onRegimeChange?.('old')}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '4px',
              backgroundColor: taxSummary.regime === 'old' ? '#121212' : 'transparent',
              color: taxSummary.regime === 'old' ? '#ffffff' : '#71717a',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: taxSummary.regime === 'old' ? '#2a2a2a' : 'rgba(0,0,0,0.05)',
              },
              py: 0.25,
              px: 1.5,
            }}
          >
            Old Regime
          </Button>
        </Box>
      </Box>

      {/* Top Banner Card: REFUND or PAYABLE */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3.5, 
          mb: 4, 
          border: '1px solid',
          borderColor: isRefund ? '#a7f3d0' : isPayable ? '#fca5a5' : 'rgba(26,26,26,0.08)',
          backgroundColor: isRefund ? '#ecfdf5' : isPayable ? '#fef2f2' : '#ffffff',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="overline" sx={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '1px', color: isRefund ? '#047857' : isPayable ? '#b91c1c' : '#71717a' }}>
              {isRefund ? '✓ EXPECTED REFUND' : isPayable ? '⚠️ SELF-ASSESSMENT TAX PAYABLE (u/s 140A)' : 'NIL BALANCE'}
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: isRefund ? '#047857' : isPayable ? '#b91c1c' : '#121212', fontFamily: "'JetBrains Mono', monospace" }}>
            ₹{taxSummary.netRefundOrPayable.toLocaleString('en-IN')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
            {isRefund 
              ? 'Excess TDS deducted will be refunded to your registered bank account upon processing.'
              : isPayable 
              ? 'Pay balance tax on incometax.gov.in (e-Pay Tax u/s 140A) before submitting return.'
              : 'Total tax liability matches TDS deducted.'}
          </Typography>
        </Box>

        {/* Action Export Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleExportMarkdown}
            startIcon={<Download fontSize="small" />}
            sx={{
              backgroundColor: '#121212',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.8rem',
              borderRadius: '4px',
              px: 2,
              py: 1,
              '&:hover': { backgroundColor: '#2d2d2d' }
            }}
          >
            Export Report (.md)
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleExportJson}
            startIcon={<FileDownload fontSize="small" />}
            sx={{
              borderColor: 'rgba(26,26,26,0.2)',
              color: '#121212',
              fontWeight: 600,
              fontSize: '0.8rem',
              borderRadius: '4px',
              px: 2,
              py: 1,
              '&:hover': { backgroundColor: 'rgba(26,26,26,0.04)', borderColor: '#121212' }
            }}
          >
            Export JSON
          </Button>
        </Box>
      </Paper>

      {/* Tax Computation Table */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Detailed Tax Calculation Breakdown
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyle}>Particulars</TableCell>
              <TableCell sx={tableHeaderStyle}>Amount</TableCell>
              <TableCell sx={tableHeaderStyle}>Rate / Basis</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>1. Gross Total Income</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.grossTotalIncome} /></TableCell>
              <TableCell sx={cellStyle}>Salary + Capital Gains + Other Sources − HP Loss</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>2. Chapter VI-A Deductions</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.totalDeductions} /></TableCell>
              <TableCell sx={cellStyle}>{taxSummary.regime === 'new' ? 'NPS Employer 80CCD(2) only' : '80C, 80D, 80CCD, 80TTA'}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.02)' }}>
              <TableCell sx={{ ...titleCellStyle, fontWeight: 700 }}>3. Net Taxable Income</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.netTaxableIncome} /></TableCell>
              <TableCell sx={cellStyle}>Gross Total Income − Deductions</TableCell>
            </TableRow>
            
            {/* Tax Computation Rows */}
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>Tax on Normal Income (Slab Rate)</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.slabTax} /></TableCell>
              <TableCell sx={cellStyle}>As per {taxSummary.regime.toUpperCase()} regime slabs</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>Tax on STCG u/s 111A</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.stcgTax20} /></TableCell>
              <TableCell sx={cellStyle}>20% on Net Taxable STCG</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>Tax on LTCG u/s 112A</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.ltcgTax12_5} /></TableCell>
              <TableCell sx={cellStyle}>12.5% on LTCG above ₹1.25L</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>Less: Rebate u/s 87A</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.rebate87A} /></TableCell>
              <TableCell sx={cellStyle}>{taxSummary.regime === 'new' ? 'Max ₹25,000 if income ≤ ₹7L' : 'Max ₹12,500 if income ≤ ₹5L'}</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>Add: Health & Education Cess</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.cess4Pct} /></TableCell>
              <TableCell sx={cellStyle}>4% of Tax after rebate</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.03)' }}>
              <TableCell sx={{ ...titleCellStyle, fontWeight: 700 }}>Total Tax Liability</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.totalTaxLiability} /></TableCell>
              <TableCell sx={cellStyle}>Total tax payable before TDS credits</TableCell>
            </TableRow>

            {/* TDS Credit Rows */}
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>Less: Salary TDS (Form 16)</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.salaryTds} /></TableCell>
              <TableCell sx={cellStyle}>TDS u/s 192 deducted by employer</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>Less: Bank / Dividend TDS (Form 16A)</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={taxSummary.bankTds} /></TableCell>
              <TableCell sx={cellStyle}>TDS u/s 194A / 194 deducted by bank</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.04)' }}>
              <TableCell sx={{ ...titleCellStyle, fontWeight: 800, fontSize: '1.05rem' }}>
                NET {taxSummary.status}
              </TableCell>
              <TableCell sx={{ ...cellStyle, fontWeight: 800, color: isRefund ? '#047857' : isPayable ? '#b91c1c' : '#121212' }}>
                <CopyableField value={taxSummary.netRefundOrPayable} />
              </TableCell>
              <TableCell sx={{ ...cellStyle, fontWeight: 600, color: isRefund ? '#047857' : isPayable ? '#b91c1c' : '#121212' }}>
                {isRefund ? 'Excess TDS Refund' : isPayable ? 'Tax Due to be paid u/s 140A' : 'Nil'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TaxSummary;
