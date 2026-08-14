import React, { useState } from 'react';
import {
  Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails,
  Chip, List, ListItem, ListItemIcon, ListItemText, Divider, Alert
} from '@mui/material';
import {
  ExpandMore, CheckCircleOutlined, HelpOutlined, Description, PlayCircleOutlined,
  AssignmentTurnedIn, Lightbulb, Warning, AutoAwesome, History, FileDownload
} from '@mui/icons-material';

import { getCurrentTaxYear } from '../utils/dateHelper';

const GuidancePage: React.FC = () => {
  const taxYear = getCurrentTaxYear();
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const cardStyle = {
    p: 3,
    backgroundColor: '#ffffff',
    border: '1px solid rgba(26,26,26,0.06)',
    borderRadius: '6px',
    mb: 3
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <Box sx={{
        mb: 4, p: { xs: 3, md: 4 }, borderRadius: '6px',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(26, 26, 26, 0.06)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Chip
            label="E-FILING MANUAL"
            size="small"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.65rem',
              fontWeight: 700,
              backgroundColor: '#f4f4f5',
              color: '#1a1a1a',
              borderRadius: '4px',
            }}
          />
          <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', color: '#71717a', fontSize: '0.75rem' }}>
            {taxYear.fy} ({taxYear.ay})
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px', color: '#121212', mb: 1.5 }}>
          ITR-2 Filing Guidance & Portal Manual
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666', maxWidth: 720, fontSize: '0.95rem', lineHeight: 1.6 }}>
          Complete reference guide on how to download your tax documents, fetch previous year loss details, copy values into incometax.gov.in, understand tax rates, and avoid filing errors.
        </Typography>
      </Box>

      {/* Quick Checklist */}
      <Paper elevation={0} sx={cardStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AssignmentTurnedIn sx={{ color: '#10b981' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            Pre-Filing Checklist
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <List dense disablePadding>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleOutlined sx={{ fontSize: 18, color: '#10b981' }} /></ListItemIcon>
              <ListItemText primary="Groww Capital Gains Report (.xlsx)" secondary="Downloaded from Groww app/web for FY 2025-26" />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleOutlined sx={{ fontSize: 18, color: '#10b981' }} /></ListItemIcon>
              <ListItemText primary="Bank Interest Certificate / Statement" secondary="PDF, Excel, or CSV from NetBanking" />
            </ListItem>
          </List>
          <List dense disablePadding>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleOutlined sx={{ fontSize: 18, color: '#10b981' }} /></ListItemIcon>
              <ListItemText primary="Form 16 Part B (from employer)" secondary="PDF containing Salary breakdown & TAN" />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleOutlined sx={{ fontSize: 18, color: '#10b981' }} /></ListItemIcon>
              <ListItemText primary="Previous Year ITR JSON / Ack PDF" secondary="For auto-fetching brought forward STCL / LTCL" />
            </ListItem>
          </List>
        </Box>
      </Paper>

      {/* Accordion FAQ & Step-by-Step Sections */}
      <Box sx={{ mb: 4 }}>
        {/* Section 0: How to fetch previous year details */}
        <Accordion
          expanded={expanded === 'panel0'}
          onChange={handleChange('panel0')}
          elevation={0}
          sx={{ backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.08)', mb: 1.5, borderRadius: '6px !important', '&::before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <History sx={{ color: '#8b5cf6' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                How to Fetch Previous Year Loss Details (Schedule CFL & BFLA)
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: '1px solid rgba(26,26,26,0.06)', pt: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#666666', mb: 2, lineHeight: 1.6 }}>
              If you incurred capital losses in previous financial years and filed your return on time (u/s 139(1)), you can set off those losses against this year's gains. Here are the 4 ways to find your carried forward loss numbers:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, backgroundColor: '#faf8f5', borderRadius: '4px', borderLeft: '3px solid #8b5cf6' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Option A: Auto-Extract using Past ITR JSON (Easiest)</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  1. Log in to <a href="https://www.incometax.gov.in" target="_blank" rel="noreferrer" style={{ color: '#8b5cf6' }}>incometax.gov.in</a>.<br />
                  2. Go to <strong>e-File</strong> → <strong>Income Tax Returns</strong> → <strong>View Filed Returns</strong>.<br />
                  3. Click <strong>Download Form (JSON)</strong> for AY 2025-26 or AY 2024-25.<br />
                  4. Upload that <code>.json</code> file into the <strong>Past ITR JSON</strong> slot on the upload screen in this app — it will automatically extract your brought forward STCL and LTCL!
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: '#faf8f5', borderRadius: '4px', borderLeft: '3px solid #8b5cf6' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Option B: From your Previous Year's Filed ITR Form (PDF)</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  Open your saved ITR-2 / ITR-3 PDF for AY 2025-26 → Scroll to <strong>Schedule CFL (Carry Forward of Loss)</strong> → Note the unabsorbed loss totals for Short-Term Loss (STCL) and Long-Term Loss (LTCL).
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: '#faf8f5', borderRadius: '4px', borderLeft: '3px solid #8b5cf6' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Option C: Income Tax Portal Auto-Prefill</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  When you initiate your return online on `incometax.gov.in`, the portal automatically pre-fills brought forward losses into Schedule BFLA from your previous processed return.
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Section 1: How to get your files */}
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
          elevation={0}
          sx={{ backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.08)', mb: 1.5, borderRadius: '6px !important', '&::before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Description sx={{ color: '#3b82f6' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                1. How to Download Required Source Documents
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: '1px solid rgba(26,26,26,0.06)', pt: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>Groww Capital Gains Report (.xlsx)</Typography>
            <Typography variant="body2" sx={{ color: '#666666', mb: 2, lineHeight: 1.6 }}>
              1. Open Groww app or web portal → Go to <strong>Profile</strong> → <strong>Reports</strong>.<br />
              2. Select <strong>Capital Gains Report</strong>.<br />
              3. Choose Financial Year: <strong>FY 2025-26</strong>.<br />
              4. Download format: <strong>Excel (.xlsx)</strong>.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>Bank Interest Certificate / Statement (.pdf / .xlsx / .csv)</Typography>
            <Typography variant="body2" sx={{ color: '#666666', mb: 2, lineHeight: 1.6 }}>
              1. Log in to your NetBanking portal (HDFC, SBI, ICICI, Axis, etc.).<br />
              2. Navigate to <strong>Services / Accounts</strong> → <strong>Tax / Interest Certificate</strong>.<br />
              3. Download the Interest Certificate for FY 2025-26 or export account statement as PDF/Excel.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>Form 16 Part B (.pdf)</Typography>
            <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.6 }}>
              1. Download Form 16 Part B PDF issued by your employer's HR portal (e.g. Darwinbox, Keka, GreytHR).<br />
              2. Ensure it includes Part B (Salary computation and Chapter VI-A deductions).
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Section 2: Step-by-Step Portal Navigation */}
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
          elevation={0}
          sx={{ backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.08)', mb: 1.5, borderRadius: '6px !important', '&::before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PlayCircleOutlined sx={{ color: '#10b981' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                2. Step-by-Step Navigation on incometax.gov.in
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: '1px solid rgba(26,26,26,0.06)', pt: 2.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, backgroundColor: '#faf8f5', borderRadius: '4px', borderLeft: '3px solid #10b981' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Step 1: Log in & Initiate Filing</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  Go to <a href="https://www.incometax.gov.in" target="_blank" rel="noreferrer" style={{ color: '#10b981' }}>incometax.gov.in</a> → <strong>e-File</strong> → <strong>Income Tax Returns</strong> → <strong>File Income Tax Return</strong>.
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: '#faf8f5', borderRadius: '4px', borderLeft: '3px solid #10b981' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Step 2: Select Filing Parameters</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  • Assessment Year: <strong>AY 2026-27 (Current AY)</strong><br />
                  • Mode of Filing: <strong>Online</strong><br />
                  • Status: <strong>Individual</strong><br />
                  • Select Form: <strong>ITR-2</strong> (Required for Capital Gains)
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: '#faf8f5', borderRadius: '4px', borderLeft: '3px solid #10b981' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Step 3: Select Schedules</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  Check the required schedules:<br />
                  ✔ <strong>Schedule S</strong> (Salary)<br />
                  ✔ <strong>Schedule CG</strong> (Capital Gains)<br />
                  ✔ <strong>Schedule 112A</strong> (LTCG Scrip-wise)<br />
                  ✔ <strong>Schedule OS</strong> (Other Sources)<br />
                  ✔ <strong>Schedule VI-A</strong> (Deductions)<br />
                  ✔ <strong>Schedule BFLA / CFL</strong> (Carried Forward Losses, if applicable)
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: '#faf8f5', borderRadius: '4px', borderLeft: '3px solid #10b981' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Step 4: Copy-Paste Values using ITR-2 Helper</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  Open each tab in this app, click the <strong>[COPY]</strong> button next to each field, and paste the unformatted number directly into the corresponding portal field.
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Section 3: Tax Rates & Rules for FY 2025-26 */}
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
          elevation={0}
          sx={{ backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.08)', mb: 1.5, borderRadius: '6px !important', '&::before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Lightbulb sx={{ color: '#f59e0b' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                3. FY 2025-26 (AY 2026-27) Tax Rates & Key Rules Summary
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: '1px solid rgba(26,26,26,0.06)', pt: 2.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Short-Term Capital Gains (STCG u/s 111A)</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  • <strong>Tax Rate</strong>: <strong>20%</strong> (Revised from 15% under Union Budget 2024).<br />
                  • Applies to equity shares & equity mutual funds held for ≤ 12 months.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Long-Term Capital Gains (LTCG u/s 112A)</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  • <strong>Tax Rate</strong>: <strong>12.5%</strong> (Revised from 10% under Union Budget 2024).<br />
                  • <strong>Exemption Limit</strong>: First <strong>₹1,25,000</strong> of aggregate LTCG per financial year is exempt from tax.<br />
                  • Grandfathering clause applies for shares acquired on/before 31st Jan 2018 (FMV consideration).
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Brought Forward Losses Set-Off Rules</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  • <strong>Past LTCL</strong>: Can set off <strong>ONLY against LTCG</strong>.<br />
                  • <strong>Past STCL</strong>: Can set off against <strong>STCG first, then remaining against LTCG</strong>.<br />
                  • Can be carried forward for up to <strong>8 Assessment Years</strong> if return was filed on time.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Old vs New Tax Regime</Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                  • <strong>New Tax Regime is DEFAULT</strong> for FY 2025-26.<br />
                  • Section 80C, 80D, and 80TTA are <strong>NOT available</strong> in New Regime.<br />
                  • Employer NPS contribution u/s 80CCD(2) and Standard Deduction (₹75,000) ARE allowed in New Regime.<br />
                  • Brought forward capital loss set-offs ARE allowed in New Regime.
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Section 4: Common Pitfalls & AIS Verification */}
        <Accordion
          expanded={expanded === 'panel4'}
          onChange={handleChange('panel4')}
          elevation={0}
          sx={{ backgroundColor: '#ffffff', border: '1px solid rgba(26,26,26,0.08)', borderRadius: '6px !important', '&::before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Warning sx={{ color: '#ef4444' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                4. Common Pitfalls & AIS Cross-Verification
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: '1px solid rgba(26,26,26,0.06)', pt: 2.5 }}>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: '4px' }}>
              <strong>Important:</strong> Discrepancies between your declared ITR values and the Annual Information Statement (AIS) / Form 26AS will trigger automated tax notices!
            </Alert>
            <List dense disablePadding>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}><HelpOutlined sx={{ fontSize: 18, color: '#ef4444' }} /></ListItemIcon>
                <ListItemText primary="Not Disclosing Savings Bank Interest" secondary="Even small savings interest must be reported under Schedule OS. Section 80TTA deduction (max ₹10k) applies only in Old Regime." />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}><HelpOutlined sx={{ fontSize: 18, color: '#ef4444' }} /></ListItemIcon>
                <ListItemText primary="Skipping Quarterly Breakdown (Item E)" secondary="Entering total capital gains without filling the 5 date buckets will lead to incorrect interest calculation u/s 234C." />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}><HelpOutlined sx={{ fontSize: 18, color: '#ef4444' }} /></ListItemIcon>
                <ListItemText primary="Missing Scrip-wise Schedule 112A details" secondary="For long-term equity transactions with STT paid, scrip-wise details (ISIN, sale price, buy price) are mandatory." />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Footer Banner */}
      <Paper elevation={0} sx={{ p: 3, backgroundColor: '#faf8f5', border: '1px solid rgba(26,26,26,0.08)', borderRadius: '6px', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <AutoAwesome sx={{ color: '#10b981', fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Ready to process your tax files?
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#666666', mb: 2 }}>
          Switch to the ITR-2 Field Guide tab to upload your files or try demo data.
        </Typography>
      </Paper>
    </Box>
  );
};

export default GuidancePage;
