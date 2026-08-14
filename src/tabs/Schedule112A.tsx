import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CopyableField from '../components/CopyableField';
import { Schedule112AItem } from '../types/itr';

interface Schedule112AProps {
  data: Schedule112AItem[] | null;
}

const Schedule112A: React.FC<Schedule112AProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', animation: 'fadeIn 0.4s ease-out' }}>
        <Typography variant="body1" sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#71717a' }}>
          &gt; no LTCG transactions found — Schedule 112A not required
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

  const totalGain = data.reduce((acc, row) => acc + (row.capitalGain || 0), 0);
  const totalSale = data.reduce((acc, row) => acc + (row.saleValue || 0), 0);
  const totalCost = data.reduce((acc, row) => acc + (row.costOfAcquisition || 0), 0);

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out' }}>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', maxHeight: '600px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyle}>ISIN Code</TableCell>
              <TableCell sx={tableHeaderStyle}>Share/Fund Name</TableCell>
              <TableCell sx={tableHeaderStyle}>Units Sold</TableCell>
              <TableCell sx={tableHeaderStyle}>Sale Price</TableCell>
              <TableCell sx={tableHeaderStyle}>Cost of Acquisition</TableCell>
              <TableCell sx={tableHeaderStyle}>FMV (31 Jan 2018)</TableCell>
              <TableCell sx={tableHeaderStyle}>Capital Gain</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
                <TableCell sx={{ ...cellStyle, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: '#1a1a1a', fontSize: '0.8rem' }}>
                  <CopyableField value={row.isin} isCurrency={false} />
                </TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 500 }}>{row.name}</TableCell>
                <TableCell sx={cellStyle}><CopyableField value={row.qty} isCurrency={false} /></TableCell>
                <TableCell sx={cellStyle}><CopyableField value={row.saleValue} /></TableCell>
                <TableCell sx={cellStyle}><CopyableField value={row.costOfAcquisition} /></TableCell>
                <TableCell sx={cellStyle}>
                  {row.fmv31Jan2018 === 0 ? (
                    <Typography variant="body2" sx={{ color: '#a1a1aa', fontFamily: "'JetBrains Mono', monospace" }}>N/A</Typography>
                  ) : (
                    <CopyableField value={row.fmv31Jan2018} />
                  )}
                </TableCell>
                <TableCell sx={{ ...cellStyle, color: row.capitalGain >= 0 ? '#10b981' : '#ef4444' }}>
                  <CopyableField value={row.capitalGain} />
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.04)' }}>
              <TableCell colSpan={3} sx={{ ...cellStyle, fontWeight: 700, textAlign: 'right' }}>TOTALS</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={totalSale} /></TableCell>
              <TableCell sx={cellStyle}><CopyableField value={totalCost} /></TableCell>
              <TableCell sx={cellStyle}></TableCell>
              <TableCell sx={{ ...cellStyle, fontWeight: 700, color: totalGain >= 0 ? '#10b981' : '#ef4444' }}>
                <CopyableField value={totalGain} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Schedule112A;
