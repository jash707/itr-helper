import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CopyableField from '../components/CopyableField';
import { ScheduleOSData } from '../types/itr';

interface ScheduleOSProps {
  data: ScheduleOSData | null;
}

const ScheduleOS: React.FC<ScheduleOSProps> = ({ data }) => {
  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', animation: 'fadeIn 0.4s ease-out' }}>
        <Typography variant="body1" sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#71717a' }}>
          &gt; no data available for other sources
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

  const divLabels = data.dividendQuarterly?.labels || [];
  const divValues = data.dividendQuarterly?.values || [];

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out' }}>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyle}>Portal Field</TableCell>
              <TableCell sx={tableHeaderStyle}>Value</TableCell>
              <TableCell sx={tableHeaderStyle}>Source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>1a(i) Savings Bank Interest</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.savingsInterest} /></TableCell>
              <TableCell sx={cellStyle}>Bank Statement / Certificate</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>1a(ii) Dividend Income</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.dividendIncome} /></TableCell>
              <TableCell sx={cellStyle}>Groww Report</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>1a(iii) FD/RD Interest</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.fdRdInterest} /></TableCell>
              <TableCell sx={cellStyle}>Bank Statement / Certificate</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.04)' }}>
              <TableCell sx={{ ...titleCellStyle, fontWeight: 700 }}>Total Income from Other Sources</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.totalOtherSources} /></TableCell>
              <TableCell sx={cellStyle}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {divValues.some(v => v > 0) && (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>Dividend Quarterly Breakdown</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderStyle}>Time Period</TableCell>
                  <TableCell sx={tableHeaderStyle}>Dividend Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {divLabels.map((label, i) => (
                  <TableRow key={i} hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
                    <TableCell sx={titleCellStyle}>{label}</TableCell>
                    <TableCell sx={cellStyle}><CopyableField value={divValues[i] || 0} /></TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.04)' }}>
                  <TableCell sx={{ ...titleCellStyle, fontWeight: 700 }}>Total</TableCell>
                  <TableCell sx={cellStyle}><CopyableField value={data.dividendIncome} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Typography variant="body2" sx={{ color: '#71717a', fontStyle: 'italic', mt: 2 }}>
        Note: Dividend income is taxable at slab rate from AY 2021-22 onwards.
      </Typography>
    </Box>
  );
};

export default ScheduleOS;
