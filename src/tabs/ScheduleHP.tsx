import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import CopyableField from '../components/CopyableField';
import { ScheduleHPData } from '../types/itr';

interface ScheduleHPProps {
  data: ScheduleHPData | null;
}

const ScheduleHP: React.FC<ScheduleHPProps> = ({ data }) => {
  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', animation: 'fadeIn 0.4s ease-out' }}>
        <Typography variant="body1" sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#71717a' }}>
          &gt; no house property / home loan interest data entered
        </Typography>
      </Box>
    );
  }

  const tableHeaderStyle = {
    backgroundColor: '#faf8f5',
    textTransform: 'uppercase' as const,
    fontFamily: "'JetBrains Mono', monospace",
    color: '#71717a',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.5px'
  };

  const cellStyle = {
    borderBottom: '1px solid rgba(26,26,26,0.06)',
    padding: '12px 16px'
  };

  const titleCellStyle = {
    ...cellStyle,
    fontWeight: 600,
    color: '#1a1a1a'
  };

  const isSelfOccupied = data.propertyType === 'self_occupied';

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Chip 
          label={`Property Type: ${isSelfOccupied ? 'Self-Occupied' : 'Let-Out'}`} 
          size="small" 
          sx={{ backgroundColor: '#faf8f5', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', border: '1px solid rgba(26,26,26,0.1)' }} 
        />
        <Chip 
          label="Section 24b Interest" 
          size="small" 
          sx={{ backgroundColor: '#ecfdf5', color: '#047857', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', border: '1px solid #a7f3d0' }} 
        />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyle}>Portal Field</TableCell>
              <TableCell sx={tableHeaderStyle}>Value</TableCell>
              <TableCell sx={tableHeaderStyle}>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isSelfOccupied && (
              <>
                <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
                  <TableCell sx={titleCellStyle}>1a. Gross Rental Income Received</TableCell>
                  <TableCell sx={cellStyle}><CopyableField value={data.grossRentalIncome} /></TableCell>
                  <TableCell sx={cellStyle}>Actual rent received/receivable</TableCell>
                </TableRow>
                <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
                  <TableCell sx={titleCellStyle}>1b. Municipal Taxes Paid</TableCell>
                  <TableCell sx={cellStyle}><CopyableField value={data.municipalTaxesPaid} /></TableCell>
                  <TableCell sx={cellStyle}>Local taxes paid to municipal body</TableCell>
                </TableRow>
                <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
                  <TableCell sx={titleCellStyle}>1c. Net Annual Value (NAV)</TableCell>
                  <TableCell sx={cellStyle}><CopyableField value={data.netAnnualValue} /></TableCell>
                  <TableCell sx={cellStyle}>Gross Rent − Municipal Taxes</TableCell>
                </TableRow>
                <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
                  <TableCell sx={titleCellStyle}>1d. Standard Deduction u/s 24(a)</TableCell>
                  <TableCell sx={cellStyle}><CopyableField value={data.standardDeduction30Pct} /></TableCell>
                  <TableCell sx={cellStyle}>30% of Net Annual Value</TableCell>
                </TableRow>
              </>
            )}
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>Interest Payable on Housing Loan u/s 24(b)</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.homeLoanInterest24b} /></TableCell>
              <TableCell sx={cellStyle}>{isSelfOccupied ? 'Capped at ₹2,00,000 for self-occupied' : 'Actual interest paid'}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.04)' }}>
              <TableCell sx={{ ...titleCellStyle, fontWeight: 800, fontSize: '1.05rem' }}>Income / Loss from House Property</TableCell>
              <TableCell sx={{ ...cellStyle, color: data.incomeFromHP < 0 ? '#ef4444' : '#10b981' }}>
                <CopyableField value={data.incomeFromHP} />
              </TableCell>
              <TableCell sx={cellStyle}>
                {data.incomeFromHP < 0 ? 'House Property Loss' : 'House Property Income'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {data.incomeFromHP < 0 && (
        <Typography variant="body2" sx={{ color: '#71717a', fontStyle: 'italic', mt: 2 }}>
          Note: Under the Old Tax Regime, up to ₹2,00,000 HP loss can be set off against Salary/Other Income. Under the New Tax Regime, HP loss cannot be set off against other heads of income.
        </Typography>
      )}
    </Box>
  );
};

export default ScheduleHP;
