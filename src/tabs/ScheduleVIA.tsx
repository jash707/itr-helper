import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import CopyableField from '../components/CopyableField';
import { ScheduleVIAData } from '../types/itr';

interface ScheduleVIAProps {
  data: ScheduleVIAData | null;
}

const ScheduleVIA: React.FC<ScheduleVIAProps> = ({ data }) => {
  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', animation: 'fadeIn 0.4s ease-out' }}>
        <Typography variant="body1" sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#71717a' }}>
          &gt; no deductions data available
        </Typography>
      </Box>
    );
  }

  const isNewRegime = data.regime === 'new';

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

  const strikeStyle = (allowedInNew: boolean) => {
    return isNewRegime && !allowedInNew ? { textDecoration: 'line-through', color: '#a1a1aa' } : {};
  };

  const deductions = [
    { label: '80C (Investments)', value: data.s80C, notes: 'EPF + PPF + ELSS + LIC — Max ₹1,50,000', allowedInNew: false },
    { label: '80CCD(1B) (NPS Self)', value: data.s80CCD_1B, notes: 'Max ₹50,000', allowedInNew: false },
    { label: '80CCD(2) (NPS Employer)', value: data.s80CCD_2, notes: 'No cap — allowed in both regimes', allowedInNew: true },
    { label: '80D (Health Insurance)', value: data.s80D, notes: 'Self + Family + Parents', allowedInNew: false },
    { label: '80TTA (Savings Interest)', value: data.s80TTA, notes: 'Max ₹10,000 — Old Regime Only', allowedInNew: false },
    { label: '80E (Education Loan)', value: data.s80E || 0, notes: 'Interest on education loan', allowedInNew: false },
    { label: '80G (Donations)', value: data.s80G || 0, notes: 'Donations to charitable funds', allowedInNew: false },
  ].filter(d => d.value > 0 || !isNewRegime);

  const totalDeductions = deductions.reduce((sum, d) => {
    if (isNewRegime && !d.allowedInNew) return sum;
    return sum + (d.value || 0);
  }, 0);

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Chip
          label={isNewRegime ? 'NEW REGIME' : 'OLD REGIME'}
          sx={{
            backgroundColor: isNewRegime ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: isNewRegime ? '#d97706' : '#059669',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: '0.75rem',
          }}
        />
        {isNewRegime && (
          <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 500, fontSize: '0.85rem' }}>
            Most deductions u/s 80 are NOT allowed under the New Tax Regime.
          </Typography>
        )}
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyle}>Section</TableCell>
              <TableCell sx={tableHeaderStyle}>Eligible Amount</TableCell>
              <TableCell sx={tableHeaderStyle}>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deductions.map((d, i) => (
              <TableRow key={i} hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
                <TableCell sx={{ ...titleCellStyle, ...strikeStyle(d.allowedInNew) }}>{d.label}</TableCell>
                <TableCell sx={{ ...cellStyle, ...strikeStyle(d.allowedInNew) }}><CopyableField value={d.value} /></TableCell>
                <TableCell sx={{ ...cellStyle, ...strikeStyle(d.allowedInNew), fontSize: '0.8rem', color: '#71717a' }}>{d.notes}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.04)' }}>
              <TableCell sx={{ ...titleCellStyle, fontWeight: 700 }}>Total Eligible Deductions</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={totalDeductions} /></TableCell>
              <TableCell sx={{ ...cellStyle, fontSize: '0.8rem', color: '#71717a' }}>
                {isNewRegime ? 'Only 80CCD(2) counted' : 'All sections applicable'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ScheduleVIA;
