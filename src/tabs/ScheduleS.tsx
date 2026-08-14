import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import CopyableField from '../components/CopyableField';
import { ScheduleSData } from '../types/itr';

interface ScheduleSProps {
  data: ScheduleSData | null;
}

const ScheduleS: React.FC<ScheduleSProps> = ({ data }) => {
  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', animation: 'fadeIn 0.4s ease-out' }}>
        <Typography variant="body1" sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#71717a' }}>
          &gt; form16.pdf not uploaded — salary data unavailable
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

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Chip 
          label={`Employer: ${data.employerName || 'Unknown'}`} 
          size="small" 
          sx={{ backgroundColor: '#faf8f5', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', border: '1px solid rgba(26,26,26,0.1)' }} 
        />
        <Chip 
          label={`TAN: ${data.employerTAN || 'Unknown'}`} 
          size="small" 
          sx={{ backgroundColor: '#faf8f5', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', border: '1px solid rgba(26,26,26,0.1)' }} 
        />
        <Chip
          label={data.regime === 'new' ? 'NEW REGIME' : 'OLD REGIME'}
          size="small"
          sx={{
            backgroundColor: data.regime === 'new' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: data.regime === 'new' ? '#d97706' : '#059669',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            fontWeight: 700,
          }}
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
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>1a. Salary u/s 17(1)</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.salary17_1} /></TableCell>
              <TableCell sx={cellStyle}>Gross Salary</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>1b. Value of perquisites u/s 17(2)</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.perquisites17_2} /></TableCell>
              <TableCell sx={cellStyle}></TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>1c. Profits in lieu of salary u/s 17(3)</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.profits17_3} /></TableCell>
              <TableCell sx={cellStyle}></TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.02)' }}>
              <TableCell sx={{ ...titleCellStyle, fontWeight: 700 }}>2. Total Gross Salary</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.totalGrossSalary} /></TableCell>
              <TableCell sx={cellStyle}>17(1) + 17(2) + 17(3)</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>3. Allowances exempt u/s 10</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.exemptAllowances_s10} /></TableCell>
              <TableCell sx={cellStyle}>HRA, LTA, etc.</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>4. Balance Salary</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.balanceSalary} /></TableCell>
              <TableCell sx={cellStyle}>Gross − Exempt</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>5a. Standard Deduction u/s 16(ia)</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.standardDeduction} /></TableCell>
              <TableCell sx={cellStyle}>Max ₹75,000</TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>5b. Entertainment Allowance u/s 16(ii)</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.entertainmentAllowance} /></TableCell>
              <TableCell sx={cellStyle}></TableCell>
            </TableRow>
            <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
              <TableCell sx={titleCellStyle}>5c. Professional Tax u/s 16(iii)</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.professionalTax} /></TableCell>
              <TableCell sx={cellStyle}></TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.02)' }}>
              <TableCell sx={{ ...titleCellStyle, fontWeight: 700 }}>6. Total Deductions u/s 16</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.totalDeductions_s16} /></TableCell>
              <TableCell sx={cellStyle}>16(ia) + 16(ii) + 16(iii)</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.04)' }}>
              <TableCell sx={{ ...titleCellStyle, fontWeight: 800, fontSize: '1.05rem' }}>7. Income under head Salaries</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.incomeFromSalary} /></TableCell>
              <TableCell sx={cellStyle}>Balance − Deductions</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ScheduleS;
