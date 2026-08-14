import React, { useState, ChangeEvent } from 'react';
import { Box, Typography, Button, Paper, LinearProgress, TextField, Accordion, AccordionSummary, AccordionDetails, Alert, MenuItem } from '@mui/material';
import { Description, AccountBalance, Receipt, CheckCircle, ExpandMore, History, Code, Home } from '@mui/icons-material';
import { parseGrowwXLSX } from '../parsers/growwParser';
import { parseBankStatement } from '../parsers/bankParser';
import { parseForm16 } from '../parsers/form16Parser';
import { parsePreviousYearITRJson } from '../parsers/jsonParser';
import { RawParsedInputs, BroughtForwardLosses, HousePropertyInputs } from '../types/itr';

interface FileUploaderProps {
  onFilesProcessed: (parsedData: RawParsedInputs) => void;
  onUseSampleData: (bfLosses?: BroughtForwardLosses, hpInputs?: HousePropertyInputs) => void;
}

interface UploadedFiles {
  groww: File | null;
  bank: File | null;
  form16: File | null;
  itrJson: File | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesProcessed, onUseSampleData }) => {
  const [files, setFiles] = useState<UploadedFiles>({
    groww: null,
    bank: null,
    form16: null,
    itrJson: null,
  });
  const [processing, setProcessing] = useState(false);

  // Carried forward losses state
  const [stclBF, setStclBF] = useState<string>('0');
  const [ltclBF, setLtclBF] = useState<string>('0');
  const [jsonExtractionMsg, setJsonExtractionMsg] = useState<string | null>(null);

  // House Property state
  const [propertyType, setPropertyType] = useState<'self_occupied' | 'let_out'>('self_occupied');
  const [homeLoanInterest, setHomeLoanInterest] = useState<string>('0');
  const [grossRent, setGrossRent] = useState<string>('0');
  const [municipalTax, setMunicipalTax] = useState<string>('0');

  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(false);

  const handleFileUpload = async (type: keyof UploadedFiles, event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    if (uploadedFile) {
      setFiles(prev => ({ ...prev, [type]: uploadedFile }));

      // If user uploaded previous year ITR JSON, auto-extract losses!
      if (type === 'itrJson') {
        const extractedLosses = await parsePreviousYearITRJson(uploadedFile);
        setStclBF(String(extractedLosses.stclPreviousYears));
        setLtclBF(String(extractedLosses.ltclPreviousYears));
        setAccordionExpanded(true);

        if (extractedLosses.stclPreviousYears > 0 || extractedLosses.ltclPreviousYears > 0) {
          setJsonExtractionMsg(
            `Extracted Brought Forward Losses from ${uploadedFile.name} — STCL: ₹${extractedLosses.stclPreviousYears.toLocaleString('en-IN')} | LTCL: ₹${extractedLosses.ltclPreviousYears.toLocaleString('en-IN')}`
          );
        } else {
          setJsonExtractionMsg(
            `Parsed ${uploadedFile.name} — No unabsorbed carried forward losses found in Schedule CFL.`
          );
        }
      }
    }
  };

  const getBfLosses = (): BroughtForwardLosses => ({
    stclPreviousYears: parseFloat(stclBF) || 0,
    ltclPreviousYears: parseFloat(ltclBF) || 0,
  });

  const getHpInputs = (): HousePropertyInputs => ({
    propertyType,
    homeLoanInterest24b: parseFloat(homeLoanInterest) || 0,
    grossRentalIncome: parseFloat(grossRent) || 0,
    municipalTaxesPaid: parseFloat(municipalTax) || 0,
  });

  const handleProcessFiles = async () => {
    setProcessing(true);
    try {
      let parsedBfLosses = getBfLosses();
      if (files.itrJson && parsedBfLosses.stclPreviousYears === 0 && parsedBfLosses.ltclPreviousYears === 0) {
        parsedBfLosses = await parsePreviousYearITRJson(files.itrJson);
      }

      const parsedData: RawParsedInputs = {
        growwData: files.groww ? await parseGrowwXLSX(files.groww) : null,
        bankData: files.bank ? await parseBankStatement(files.bank) : null,
        form16Data: files.form16 ? await parseForm16(files.form16) : null,
        bfLosses: parsedBfLosses,
        houseProperty: getHpInputs(),
      };
      onFilesProcessed(parsedData);
    } catch (error) {
      console.error("Error processing files", error);
    } finally {
      setProcessing(false);
    }
  };

  const hasAnyFile = Object.values(files).some(file => file !== null);

  const uploadBoxStyle = {
    height: 150,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed rgba(26,26,26,0.15)',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: 'rgba(26,26,26,0.4)',
      transform: 'translateY(-2px)'
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 4 Slot File Upload Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, 
        gap: 2 
      }}>
        {/* Groww Capital Gains */}
        <Paper elevation={0} sx={uploadBoxStyle} component="label">
          <input type="file" hidden accept=".xlsx" onChange={(e) => handleFileUpload('groww', e)} />
          {files.groww ? (
            <>
              <CheckCircle sx={{ color: '#10b981', mb: 1, fontSize: 32 }} />
              <Typography variant="body2" noWrap sx={{ maxWidth: '80%', fontFamily: "'JetBrains Mono', monospace" }}>
                {files.groww.name}
              </Typography>
            </>
          ) : (
            <>
              <Description sx={{ color: '#71717a', mb: 1, fontSize: 32 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Groww Capital Gains</Typography>
              <Typography variant="caption" sx={{ color: '#71717a' }}>.xlsx only</Typography>
            </>
          )}
        </Paper>

        {/* Bank Statement */}
        <Paper elevation={0} sx={uploadBoxStyle} component="label">
          <input type="file" hidden accept=".pdf,.xlsx,.csv" onChange={(e) => handleFileUpload('bank', e)} />
          {files.bank ? (
            <>
              <CheckCircle sx={{ color: '#10b981', mb: 1, fontSize: 32 }} />
              <Typography variant="body2" noWrap sx={{ maxWidth: '80%', fontFamily: "'JetBrains Mono', monospace" }}>
                {files.bank.name}
              </Typography>
            </>
          ) : (
            <>
              <AccountBalance sx={{ color: '#71717a', mb: 1, fontSize: 32 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Bank Statement</Typography>
              <Typography variant="caption" sx={{ color: '#71717a' }}>.pdf, .xlsx, .csv</Typography>
            </>
          )}
        </Paper>

        {/* Form 16 Part B */}
        <Paper elevation={0} sx={uploadBoxStyle} component="label">
          <input type="file" hidden accept=".pdf" onChange={(e) => handleFileUpload('form16', e)} />
          {files.form16 ? (
            <>
              <CheckCircle sx={{ color: '#10b981', mb: 1, fontSize: 32 }} />
              <Typography variant="body2" noWrap sx={{ maxWidth: '80%', fontFamily: "'JetBrains Mono', monospace" }}>
                {files.form16.name}
              </Typography>
            </>
          ) : (
            <>
              <Receipt sx={{ color: '#71717a', mb: 1, fontSize: 32 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Form 16 Part B</Typography>
              <Typography variant="caption" sx={{ color: '#71717a' }}>.pdf (optional)</Typography>
            </>
          )}
        </Paper>

        {/* Past Year ITR JSON */}
        <Paper elevation={0} sx={uploadBoxStyle} component="label">
          <input type="file" hidden accept=".json" onChange={(e) => handleFileUpload('itrJson', e)} />
          {files.itrJson ? (
            <>
              <CheckCircle sx={{ color: '#10b981', mb: 1, fontSize: 32 }} />
              <Typography variant="body2" noWrap sx={{ maxWidth: '80%', fontFamily: "'JetBrains Mono', monospace" }}>
                {files.itrJson.name}
              </Typography>
            </>
          ) : (
            <>
              <Code sx={{ color: '#8b5cf6', mb: 1, fontSize: 32 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Past ITR JSON</Typography>
              <Typography variant="caption" sx={{ color: '#71717a' }}>Auto-extract loss</Typography>
            </>
          )}
        </Paper>
      </Box>

      {/* JSON Extraction Feedback Message */}
      {jsonExtractionMsg && (
        <Alert severity="success" icon={<CheckCircle />} sx={{ borderRadius: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
          {jsonExtractionMsg}
        </Alert>
      )}

      {/* House Property & Home Loan Accordion */}
      <Accordion 
        elevation={0} 
        sx={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid rgba(26,26,26,0.08)', 
          borderRadius: '6px !important',
          '&::before': { display: 'none' }
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Home sx={{ color: '#047857', fontSize: '1.2rem' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              House Property & Home Loan Interest u/s 24b (Optional)
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ borderTop: '1px solid rgba(26,26,26,0.06)', pt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              select
              size="small"
              label="Property Type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as any)}
            >
              <MenuItem value="self_occupied">Self-Occupied</MenuItem>
              <MenuItem value="let_out">Let-Out (Rented)</MenuItem>
            </TextField>
            <TextField
              size="small"
              label="Home Loan Interest Paid u/s 24b"
              type="number"
              value={homeLoanInterest}
              onChange={(e) => setHomeLoanInterest(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Typography variant="caption" sx={{ mr: 0.5, color: '#71717a' }}>₹</Typography>
                }
              }}
              helperText="Capped at ₹2 Lakhs for self-occupied under Old Regime"
            />
            {propertyType === 'let_out' && (
              <>
                <TextField
                  size="small"
                  label="Gross Annual Rent Received"
                  type="number"
                  value={grossRent}
                  onChange={(e) => setGrossRent(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: <Typography variant="caption" sx={{ mr: 0.5, color: '#71717a' }}>₹</Typography>
                    }
                  }}
                />
                <TextField
                  size="small"
                  label="Municipal Taxes Paid"
                  type="number"
                  value={municipalTax}
                  onChange={(e) => setMunicipalTax(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: <Typography variant="caption" sx={{ mr: 0.5, color: '#71717a' }}>₹</Typography>
                    }
                  }}
                />
              </>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Brought Forward Losses Accordion */}
      <Accordion 
        expanded={accordionExpanded}
        onChange={(_, isExpanded) => setAccordionExpanded(isExpanded)}
        elevation={0} 
        sx={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid rgba(26,26,26,0.08)', 
          borderRadius: '6px !important',
          '&::before': { display: 'none' }
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History sx={{ color: '#8b5cf6', fontSize: '1.2rem' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Brought Forward Losses (Schedule CFL / BFLA)
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ borderTop: '1px solid rgba(26,26,26,0.06)', pt: 2 }}>
          <Typography variant="body2" sx={{ color: '#666666', mb: 2, fontSize: '0.85rem' }}>
            Auto-extracted from your uploaded Past ITR JSON above, or enter manually below:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              size="small"
              label="Carried Forward STCL (Short-Term Loss)"
              type="number"
              value={stclBF}
              onChange={(e) => setStclBF(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Typography variant="caption" sx={{ mr: 0.5, color: '#71717a' }}>₹</Typography>
                }
              }}
              helperText="Can set off against STCG & LTCG"
            />
            <TextField
              size="small"
              label="Carried Forward LTCL (Long-Term Loss)"
              type="number"
              value={ltclBF}
              onChange={(e) => setLtclBF(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Typography variant="caption" sx={{ mr: 0.5, color: '#71717a' }}>₹</Typography>
                }
              }}
              helperText="Can set off ONLY against LTCG"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {processing && <LinearProgress sx={{ height: 4, borderRadius: 2, '& .MuiLinearProgress-bar': { backgroundColor: '#10b981' } }} />}

      <Button
        variant="contained"
        fullWidth
        disabled={!hasAnyFile || processing}
        onClick={handleProcessFiles}
        sx={{
          backgroundColor: '#121212',
          color: '#ffffff',
          textTransform: 'none',
          borderRadius: '4px',
          py: 1.5,
          fontWeight: 600,
          '&:hover': { backgroundColor: '#2a2a2a' },
          '&.Mui-disabled': { backgroundColor: 'rgba(26,26,26,0.12)' }
        }}
      >
        Process Files
      </Button>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => onUseSampleData(getBfLosses(), getHpInputs())}
        sx={{
          color: '#121212',
          borderColor: '#121212',
          textTransform: 'none',
          borderRadius: '4px',
          py: 1.5,
          fontWeight: 600,
          '&:hover': { backgroundColor: 'rgba(26,26,26,0.04)', borderColor: '#121212' }
        }}
      >
        Use Sample Data
      </Button>
    </Box>
  );
};

export default FileUploader;
