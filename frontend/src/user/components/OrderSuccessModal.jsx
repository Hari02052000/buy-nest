import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

function OrderSuccessModal({ open, onClose }) {
    const navigate = useNavigate();
    function onExploreProducts(){
        navigate('/')
    }
    function onShowOrderDetails(){
        navigate('/order')
    }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx = {
        {
            borderRadius :3,
            padding:3,
            textAlign:"center"
        }
      }
    >
      <Box sx={{ mb: 2 }}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
      </Box>

      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Order Placed Successfully!
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Thank you for your purchase! Your order has been placed successfully.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            onClose();
            onExploreProducts();
          }}
        >
          Explore Products
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onClose();
            onShowOrderDetails();
          }}
        >
          Show Order Details
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderSuccessModal;
