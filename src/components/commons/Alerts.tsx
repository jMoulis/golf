import { Alert, AlertColor, Snackbar } from '@mui/material';
import React from 'react';

type Props = {
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  message: string;
  open: boolean;
  severity: AlertColor;
};

export const Alerts = ({ open, onClose, message, severity }: Props) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%', zIndex: 90000 }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
