import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import CopyableField from '../components/CopyableField';
import { ScheduleCGData } from '../types/itr';

interface ScheduleCGProps {
  data: ScheduleCGData | null;
}

const ScheduleCG: React.FC<ScheduleCGProps> = ({ data }) => {
  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', animation: 'fadeIn 0.4s ease-out' }}>
        <Typography variant="body1" sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#71717a' }}>
          &gt; groww.xlsx not uploaded — capital gains data unavailable
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

  const { quarterlyBreakdown, bfla } = data;
  const labels = quarterlyBreakdown?.labels || [];
  const stcqQ = quarterlyBreakdown?.stcg || [];
  const ltcgQ = quarterlyBreakdown?.ltcg || [];

  const hasLossSetOff = (bfla?.stclBroughtForward > 0) || (bfla?.ltclBroughtForward > 0);

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Capital Gains Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
        {/* STCG Card */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 700 }}>
              STCG u/s 111A
            </Typography>
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, px: 1, py: 0.5, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
              Tax @ 20%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666666' }}>Current Year Realized STCG</Typography>
              <CopyableField value={data.stcg111A} />
            </Box>
            {hasLossSetOff && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666666' }}>Less: Brought Forward STCL Set-off</Typography>
                <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#10b981', fontSize: '0.9rem' }}>
                  −₹{(bfla?.stclSetOffAgainstStcg || 0).toLocaleString('en-IN')}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px dashed rgba(26,26,26,0.1)' }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>Net Taxable STCG</Typography>
              <CopyableField value={bfla?.stcgNetTaxable ?? data.stcg111A} />
            </Box>
          </Box>
        </Paper>

        {/* LTCG Card */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 700 }}>
              LTCG u/s 112A
            </Typography>
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, px: 1, py: 0.5, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
              Tax @ 12.5%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666666' }}>Current Year Realized LTCG</Typography>
              <CopyableField value={data.ltcg112A} />
            </Box>
            {hasLossSetOff && (
              <>
                {(bfla?.ltclSetOffAgainstLtcg || 0) > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666666' }}>Less: Brought Forward LTCL Set-off</Typography>
                    <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#10b981', fontSize: '0.9rem' }}>
                      −₹{(bfla.ltclSetOffAgainstLtcg).toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                )}
                {(bfla?.stclSetOffAgainstLtcg || 0) > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666666' }}>Less: Brought Forward STCL Set-off</Typography>
                    <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#10b981', fontSize: '0.9rem' }}>
                      −₹{(bfla.stclSetOffAgainstLtcg).toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                )}
              </>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666666' }}>Less: Exemption (u/s 112A)</Typography>
              <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#10b981', fontSize: '0.9rem' }}>
                −₹{(data.ltcgExemption || 0).toLocaleString('en-IN')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px dashed rgba(26,26,26,0.1)' }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>Net Taxable LTCG</Typography>
              <CopyableField value={bfla?.ltcgNetTaxable ?? data.ltcgTaxable} />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Brought Forward Losses & Set-Off (Schedule BFLA & Schedule CFL) */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Schedule BFLA & CFL — Loss Set-Off & Carry Forward
          </Typography>
          {hasLossSetOff && (
            <Chip 
              label="LOSS SET-OFF APPLIED" 
              size="small" 
              sx={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 700 }} 
            />
          )}
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderStyle}>Loss Category</TableCell>
                <TableCell sx={tableHeaderStyle}>Brought Forward Loss</TableCell>
                <TableCell sx={tableHeaderStyle}>Set-Off Against STCG</TableCell>
                <TableCell sx={tableHeaderStyle}>Set-Off Against LTCG</TableCell>
                <TableCell sx={tableHeaderStyle}>Unabsorbed Loss to Carry Forward (AY 2027-28)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
                <TableCell sx={titleCellStyle}>Short-Term Capital Loss (STCL)</TableCell>
                <TableCell sx={cellStyle}><CopyableField value={bfla?.stclBroughtForward || 0} /></TableCell>
                <TableCell sx={cellStyle}><CopyableField value={bfla?.stclSetOffAgainstStcg || 0} /></TableCell>
                <TableCell sx={cellStyle}><CopyableField value={bfla?.stclSetOffAgainstLtcg || 0} /></TableCell>
                <TableCell sx={{ ...cellStyle, color: (bfla?.unabsorbedStclRemaining || 0) > 0 ? '#d97706' : '#1a1a1a', fontWeight: 600 }}>
                  <CopyableField value={bfla?.unabsorbedStclRemaining || 0} />
                </TableCell>
              </TableRow>
              <TableRow hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
                <TableCell sx={titleCellStyle}>Long-Term Capital Loss (LTCL)</TableCell>
                <TableCell sx={cellStyle}><CopyableField value={bfla?.ltclBroughtForward || 0} /></TableCell>
                <TableCell sx={cellStyle}>
                  <Typography variant="caption" sx={{ color: '#a1a1aa', fontFamily: "'JetBrains Mono', monospace" }}>N/A (Not Allowed)</Typography>
                </TableCell>
                <TableCell sx={cellStyle}><CopyableField value={bfla?.ltclSetOffAgainstLtcg || 0} /></TableCell>
                <TableCell sx={{ ...cellStyle, color: (bfla?.unabsorbedLtclRemaining || 0) > 0 ? '#d97706' : '#1a1a1a', fontWeight: 600 }}>
                  <CopyableField value={bfla?.unabsorbedLtclRemaining || 0} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Quarterly Accrual Breakdown (Item E) */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Schedule CG → Item E (Quarterly Accrual Breakdown)
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(26,26,26,0.06)', borderRadius: '6px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyle}>Time Period</TableCell>
              <TableCell sx={tableHeaderStyle}>STCG (111A)</TableCell>
              <TableCell sx={tableHeaderStyle}>LTCG (112A)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labels.map((label, i) => (
              <TableRow key={i} hover sx={{ '&:hover': { backgroundColor: 'rgba(26,26,26,0.02)' } }}>
                <TableCell sx={titleCellStyle}>{label}</TableCell>
                <TableCell sx={cellStyle}><CopyableField value={stcqQ[i] || 0} /></TableCell>
                <TableCell sx={cellStyle}><CopyableField value={ltcgQ[i] || 0} /></TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: 'rgba(26,26,26,0.04)' }}>
              <TableCell sx={{ ...titleCellStyle, fontWeight: 700 }}>Total Current Year Realized</TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.stcg111A} /></TableCell>
              <TableCell sx={cellStyle}><CopyableField value={data.ltcg112A} /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ScheduleCG;
