import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default" // 'delete' or 'publish' or 'default'
}) => {
  const getConfirmButtonStyle = () => {
    if (type === 'delete') {
      return {
        backgroundColor: '#F44336',
        '&:hover': { backgroundColor: '#D32F2F' },
      };
    }
    if (type === 'publish') {
      return {
        backgroundColor: '#66BB6A',
        '&:hover': { backgroundColor: '#4CAF50' },
      };
    }
    return {
      backgroundColor: '#D4AF37',
      '&:hover': { backgroundColor: '#C49B2D' },
    };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: '#171717',
          borderRadius: '12px',
          border: '1px solid #333',
          minWidth: '400px',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#1E1E1E',
          color: 'white',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #333',
        }}
      >
        {title}
        <IconButton
          onClick={onClose}
          sx={{
            color: '#999',
            '&:hover': {
              color: 'white',
              backgroundColor: '#333',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: '#171717',
          padding: '24px',
        }}
      >
        <Typography
          sx={{
            color: '#CCC',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '15px',
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: '#171717',
          padding: '16px 24px',
          borderTop: '1px solid #333',
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: '#444',
            '&:hover': { backgroundColor: '#555' },
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            padding: '8px 24px',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            ...getConfirmButtonStyle(),
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            padding: '8px 24px',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;