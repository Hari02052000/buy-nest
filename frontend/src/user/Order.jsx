
import  { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Button,
  Chip, Avatar, List, ListItem, ListItemAvatar, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useFetchData } from './hooks/useFetchData';
import { cancelOrderService } from '../services/order.service'



const OrderCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}));

const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  ...(status === 'delivered' && { backgroundColor: '#4caf50', color: 'white' }),
  ...(status === 'shipped' && { backgroundColor: '#2196f3', color: 'white' }),
  ...(status === 'processing' && { backgroundColor: '#ff9800', color: 'white' }),
  ...(status === 'confirmed' && { backgroundColor: '#9c27b0', color: 'white' }),
}));

const Order = () => {  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [data] = useFetchData('/order')
  const[orders,setOrders] = useState([])
  console.log(orders);
  useEffect(()=>{
    if(data?.orders){
      setOrders(data.orders)
    }
  },[data])
  console.log(data);
  
  const handleCancel = async (id) => {
    
    const confirm = window.confirm('Cancel this order?');
    if (!confirm) return;

    const res = await cancelOrderService(id)
    console.log(res);
    
   if(res?.order){
    const order = res.order
     setOrders((prev)=>[
      ...prev.filter((ord)=>ord.id!==order.id),
      order
     ])
   }    
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

  return (
    <>
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        My Orders
      </Typography>

      {orders && orders.length > 0 && orders.map((order) => (
        <OrderCard key={order.id}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Order #{order.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placed on: {formatDate(order.createdAt)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Total: ₹{order.paymentInfo.payableAmount.toLocaleString('en-IN')}
              </Typography>
              <StatusChip label={order.orderStatus.toUpperCase()} status={order.orderStatus} sx={{ mb: 2 }} />
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility />}
                  sx={{ mr: 1 }}
                  onClick={() => {
                    setSelectedOrder(order);
                    setOpenDialog(true);
                  }}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  disabled={['confirmed','shipped', 'delivered','cancelled'].includes(order.orderStatus.toLowerCase()) }
                  onClick={() => handleCancel(order.id)}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </OrderCard>
      ))}

      {/* View Order Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Items:
              </Typography>
              <List>
                {selectedOrder.items.map(item => (
                  <ListItem key={item.productId.id}>
                    <ListItemAvatar>
                      <Avatar src={item.productId.images[0].url} variant="rounded" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={`Qty: ${item.quantity} * ₹${item.price.toLocaleString('en-IN')} = ₹${item.totalPrice.toLocaleString('en-IN')} `}
                    />
                  </ListItem>
                ))}
                <ListItem>
                  <ListItemText
                     primary="payment info"
                    secondary={`Method: ${selectedOrder.paymentInfo.method} 
                    Status:${selectedOrder.paymentInfo.paymentStatus}
                    PayableAmount: ₹${selectedOrder.paymentInfo.payableAmount.toLocaleString('en-IN')}`}
                    />

                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">
                Ordered on: {formatDate(selectedOrder.createdAt)}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
};

export default Order;
