import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { formatINR, formatForCopy } from '../utils/formatters';

interface CopyableFieldProps {
  value: number | string | null | undefined;
  label?: string;
  isCurrency?: boolean;
}

const CopyableField: React.FC<CopyableFieldProps> = ({ value, label, isCurrency = true }) => {
  const [copied, setCopied] = useState(false);

  const displayValue = isCurrency ? formatINR(value) : (value ?? '');
  const rawValue = formatForCopy(value);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {label && <Typography variant="body2" sx={{ color: '#666666' }}>{label}</Typography>}
      <Typography 
        component="span"
        className={copied ? 'copy-flash' : ''}
        sx={{ 
          fontFamily: "'JetBrains Mono', monospace", 
          fontWeight: 500,
          color: '#1a1a1a',
          transition: 'background-color 0.3s ease'
        }}
      >
        {displayValue}
      </Typography>
      <Tooltip title={copied ? "Copied!" : "Copy raw value"}>
        <IconButton 
          size="small" 
          onClick={handleCopy}
          sx={{ 
            padding: '4px',
            '&:hover': { backgroundColor: 'rgba(26, 26, 26, 0.04)' }
          }}
        >
          {copied ? <Check fontSize="small" sx={{ color: '#10b981' }} /> : <ContentCopy fontSize="small" sx={{ color: '#71717a' }} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CopyableField;
