import React from 'react';
import { Box, Paper, Alert, AlertTitle } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { SanityAlert } from '../types/itr';

interface SanityAlertsProps {
  alerts: SanityAlert[];
}

const SanityAlerts: React.FC<SanityAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <Paper elevation={0} sx={{ p: 2, backgroundColor: '#ffffff', border: '1px solid rgba(26, 26, 26, 0.06)', borderRadius: '6px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {alerts.map((alert, index) => {
          let severity: 'warning' | 'error' | 'info' = 'info';
          let icon: React.ReactNode = undefined;
          if (alert.type === 'warning') severity = 'warning';
          if (alert.type === 'error') severity = 'error';
          if (alert.type === 'reminder') {
            severity = 'info';
            icon = <InfoOutlined />;
          }

          return (
            <Alert 
              key={index} 
              severity={severity} 
              icon={icon}
              sx={{ 
                borderRadius: '4px',
                '& .MuiAlertTitle-root': {
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }
              }}
            >
              <AlertTitle>{alert.title}</AlertTitle>
              {alert.message}
            </Alert>
          );
        })}
      </Box>
    </Paper>
  );
};

export default SanityAlerts;
