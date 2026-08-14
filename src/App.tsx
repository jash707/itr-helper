import React, { useState, useCallback } from 'react';
import {
  Container, Box, Typography, Tabs, Tab, Chip, Snackbar, Alert as MuiAlert,
  Button
} from '@mui/material';
import { Receipt as ReceiptIcon, MenuBook as BookIcon, Dashboard as DashboardIcon } from '@mui/icons-material';

import FileUploader from './components/FileUploader';
import SanityAlerts from './components/SanityAlerts';
import ScheduleS from './tabs/ScheduleS';
import ScheduleHP from './tabs/ScheduleHP';
import ScheduleCG from './tabs/ScheduleCG';
import Schedule112A from './tabs/Schedule112A';
import ScheduleOS from './tabs/ScheduleOS';
import ScheduleVIA from './tabs/ScheduleVIA';
import TaxSummary from './tabs/TaxSummary';
import GuidancePage from './pages/GuidancePage';

import { processITRData } from './utils/taxCalculator';
import { sampleGrowwData, sampleBankData, sampleForm16Data } from './data/sampleData';
import { ITRProcessedData, RawParsedInputs, BroughtForwardLosses, HousePropertyInputs } from './types/itr';
import { getCurrentTaxYear } from './utils/dateHelper';

const TAB_LABELS = [
  'Tax & Refund Summary',
  'Schedule S (Salary)',
  'Schedule HP (House Prop)',
  'Schedule CG (Cap Gains)',
  'Schedule 112A (LTCG)',
  'Schedule OS (Other)',
  'Schedule VI-A (Deductions)',
];

interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const App: React.FC = () => {
  const taxYear = getCurrentTaxYear();
  const [viewMode, setViewMode] = useState<'generator' | 'guidance'>('generator');
  const [activeTab, setActiveTab] = useState(0);
  const [itrData, setItrData] = useState<ITRProcessedData | null>(null);
  const [rawInputs, setRawInputs] = useState<RawParsedInputs | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'success' });

  const handleFilesProcessed = useCallback((parsedData: RawParsedInputs) => {
    try {
      setRawInputs(parsedData);
      const result = processITRData(parsedData);
      setItrData(result);
      setShowResults(true);
      setActiveTab(0);
      setToast({ open: true, message: 'Files processed successfully — ITR-2 field guide ready', severity: 'success' });
    } catch (err: any) {
      console.error('Processing error:', err);
      setToast({ open: true, message: 'Error processing files: ' + (err?.message || 'Unknown error'), severity: 'error' });
    }
  }, []);

  const handleUseSampleData = useCallback((bfLosses?: BroughtForwardLosses, hpInputs?: HousePropertyInputs) => {
    const sampleBfLosses: BroughtForwardLosses = (bfLosses && (bfLosses.stclPreviousYears > 0 || bfLosses.ltclPreviousYears > 0))
      ? bfLosses
      : { stclPreviousYears: 5000, ltclPreviousYears: 12000 };

    const sampleHpInputs: HousePropertyInputs = (hpInputs && hpInputs.homeLoanInterest24b > 0)
      ? hpInputs
      : { propertyType: 'self_occupied', homeLoanInterest24b: 180000 };

    const initialInputs: RawParsedInputs = {
      growwData: sampleGrowwData,
      bankData: sampleBankData,
      form16Data: sampleForm16Data,
      bfLosses: sampleBfLosses,
      houseProperty: sampleHpInputs,
    };
    setRawInputs(initialInputs);
    const result = processITRData(initialInputs);
    setItrData(result);
    setShowResults(true);
    setActiveTab(0);
    setToast({ open: true, message: 'Sample data loaded — explore Tax Summary & all ITR-2 tabs', severity: 'success' });
  }, []);

  const handleRegimeChange = useCallback((newRegime: 'old' | 'new') => {
    if (!rawInputs) return;
    const updatedInputs: RawParsedInputs = {
      ...rawInputs,
      overrideRegime: newRegime,
    };
    setRawInputs(updatedInputs);
    const result = processITRData(updatedInputs);
    setItrData(result);
    setToast({ open: true, message: `Switched to ${newRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime'} — tax liability re-calculated!`, severity: 'info' });
  }, [rawInputs]);

  const handleBackToUpload = useCallback(() => {
    setShowResults(false);
    setItrData(null);
    setRawInputs(null);
  }, []);

  const renderActiveTab = () => {
    if (!itrData) return null;
    switch (activeTab) {
      case 0: return <TaxSummary data={itrData} onRegimeChange={handleRegimeChange} />;
      case 1: return <ScheduleS data={itrData.scheduleS} />;
      case 2: return <ScheduleHP data={itrData.scheduleHP} />;
      case 3: return <ScheduleCG data={itrData.scheduleCG} />;
      case 4: return <Schedule112A data={itrData.schedule112A} />;
      case 5: return <ScheduleOS data={itrData.scheduleOS} />;
      case 6: return <ScheduleVIA data={itrData.scheduleVIA} />;
      default: return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#faf8f5' }}>
      {/* Top Navbar */}
      <Box sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: 'rgba(250, 248, 245, 0.85)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => { setViewMode('generator'); handleBackToUpload(); }}>
              <ReceiptIcon sx={{ color: '#1a1a1a', fontSize: '1.5rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#1a1a1a', fontSize: '1.1rem' }}>
                itr-2 helper
              </Typography>
            </Box>

            {/* Navigation View Switcher */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant={viewMode === 'generator' ? 'contained' : 'text'}
                size="small"
                onClick={() => setViewMode('generator')}
                startIcon={<DashboardIcon fontSize="small" />}
                sx={{
                  backgroundColor: viewMode === 'generator' ? '#121212' : 'transparent',
                  color: viewMode === 'generator' ? '#ffffff' : '#1a1a1a',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  px: 2,
                  '&:hover': {
                    backgroundColor: viewMode === 'generator' ? '#2a2a2a' : 'rgba(0,0,0,0.05)',
                  }
                }}
              >
                Generator
              </Button>
              <Button
                variant={viewMode === 'guidance' ? 'contained' : 'text'}
                size="small"
                onClick={() => setViewMode('guidance')}
                startIcon={<BookIcon fontSize="small" />}
                sx={{
                  backgroundColor: viewMode === 'guidance' ? '#121212' : 'transparent',
                  color: viewMode === 'guidance' ? '#ffffff' : '#1a1a1a',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  px: 2,
                  '&:hover': {
                    backgroundColor: viewMode === 'guidance' ? '#2a2a2a' : 'rgba(0,0,0,0.05)',
                  }
                }}
              >
                Filing Guide
              </Button>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, ml: 1.5 }}>
                <Chip
                  label={taxYear.fy}
                  size="small"
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    backgroundColor: '#f4f4f5',
                    color: '#71717a',
                    border: '1px solid #e4e4e7',
                    borderRadius: '4px',
                  }}
                />
                <Chip
                  label={taxYear.ay}
                  size="small"
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    border: '1px solid #a7f3d0',
                    borderRadius: '4px',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: 4, pb: 8 }}>
        {viewMode === 'guidance' ? (
          <GuidancePage />
        ) : !showResults ? (
          /* ──── Upload View ──── */
          <Box className="fade-in">
            {/* Hero */}
            <Box sx={{
              mb: 4, p: { xs: 3, md: 4 }, borderRadius: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(26, 26, 26, 0.06)',
              position: 'relative', overflow: 'hidden',
            }}>
              <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.5,
                py: 0.6,
                borderRadius: '20px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                mb: 2,
              }}>
                <Box sx={{
                  width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981',
                  boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)',
                  animation: 'pulse 2s infinite ease-in-out',
                }} />
                <Typography variant="caption" sx={{
                  fontWeight: 700,
                  color: '#15803d',
                  fontSize: '0.75rem',
                  letterSpacing: '0.2px',
                }}>
                  ITR-2 Filing Engine • {taxYear.fy} ({taxYear.ay})
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px', color: '#121212', lineHeight: 1.15, mb: 1.5 }}>
                copy-ready ITR-2 field guide
              </Typography>
              <Typography variant="body1" sx={{ color: '#666666', maxWidth: 640, fontSize: '0.95rem', lineHeight: 1.6 }}>
                Upload your Groww Capital Gains report, bank statement, and Form 16 — get a formatted guide with copy-paste values for every field on the incometax.gov.in portal.
              </Typography>
            </Box>

            <FileUploader
              onFilesProcessed={handleFilesProcessed}
              onUseSampleData={handleUseSampleData}
            />
          </Box>
        ) : (
          /* ──── Results View ──── */
          <Box className="fade-in">
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography component="code" sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                    ✓ PROCESSED
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px', color: '#121212' }}>
                  ITR-2 Portal Field Guide
                </Typography>
              </Box>
              <Box
                component="button"
                onClick={handleBackToUpload}
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(0,0,0,0.15)',
                  borderRadius: '4px',
                  px: 2,
                  py: 0.8,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { backgroundColor: '#f4f4f5', borderColor: '#1a1a1a' },
                }}
              >
                ← upload new files
              </Box>
            </Box>

            {/* Tab Bar */}
            <Box sx={{
              mb: 3,
              backgroundColor: '#ffffff',
              border: '1px solid rgba(26, 26, 26, 0.06)',
              borderRadius: '6px',
              overflow: 'hidden',
            }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#121212',
                    height: '2px',
                  },
                  '& .MuiTab-root': {
                    color: '#71717a',
                    '&.Mui-selected': { color: '#121212' },
                  },
                }}
              >
                {TAB_LABELS.map((label, i) => (
                  <Tab key={i} label={label} />
                ))}
              </Tabs>
            </Box>

            {/* Active Tab Content */}
            <Box sx={{ mb: 4 }}>
              {renderActiveTab()}
            </Box>

            {/* Sanity Alerts */}
            {itrData?.alerts && itrData.alerts.length > 0 && (
              <SanityAlerts alerts={itrData.alerts} />
            )}
          </Box>
        )}
      </Container>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, borderRadius: '6px' }}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default App;
