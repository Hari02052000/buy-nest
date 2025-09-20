import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  ShoppingBag,
  LocalShipping,
  Receipt,
  Download,
  Home,
  ViewList,
  Phone,
  Email,
  CheckCircleOutline,
  Schedule,
  Inventory,
  CreditCard
} from '@mui/icons-material';
import { green, blue, orange, red } from '@mui/material/colors';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch order details
        const orderResponse = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order details');
        }

        const orderData = await orderResponse.json();
        setOrder(orderData.data);

        // Fetch invoice details
        const invoiceResponse = await fetch(`/api/orders/${orderId}/invoice`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (invoiceResponse.ok) {
          const invoiceData = await invoiceResponse.json();
          setInvoice(invoiceData.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, navigate]);

  const downloadInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}/invoice/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to download invoice:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return orange[500];
      case 'confirmed': return green[500];
      case 'processing': return blue[500];
      case 'shipped': return blue[700];
      case 'delivered': return green[600];
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return orange[500];
      case 'paid': return green[500];
      case 'failed': return red[500];
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading order details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Error</Typography>
          <Typography>{error}</Typography>
        </Alert>
        <Box textAlign="center">
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<Home />}
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="h6">Order Not Found</Typography>
          <Typography>
            The order you're looking for doesn't exist or you don't have permission to view it.
          </Typography>
        </Alert>
        <Box textAlign="center">
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<Home />}
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Header */}
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${green[500]} 0%, ${green[600]} 100%)`,
          color: 'white',
          p: 4,
          mb: 3,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'white',
            color: green[500],
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2
          }}
        >
          <CheckCircle sx={{ fontSize: 48 }} />
        </Avatar>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Order Confirmed!
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Thank you for your purchase. Your order has been successfully placed.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingBag color="primary" />
              Order Summary
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Order Number</Typography>
                  <Typography variant="h6" fontFamily="monospace" color="primary">
                    #{order._id}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Order Date</Typography>
                  <Typography variant="h6">
                    {formatDate(order.createdAt)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    sx={{
                      bgcolor: getStatusColor(order.status),
                      color: 'white',
                      fontWeight: 'bold',
                      mt: 0.5
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Payment Status</Typography>
                  <Chip
                    label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    sx={{
                      bgcolor: getPaymentStatusColor(order.paymentStatus),
                      color: 'white',
                      fontWeight: 'bold',
                      mt: 0.5
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Order Items */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory color="primary" />
              Items Ordered
            </Typography>
            
            <Stack spacing={2} sx={{ mt: 2 }}>
              {order.items.map((item, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <CardMedia
                          component="img"
                          height="100"
                          image={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          sx={{ borderRadius: 1, objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                          {item.name}
                        </Typography>
                        <Typography variant="body1" color="primary" fontWeight="bold">
                          {formatCurrency(item.price)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3} textAlign="right">
                        <Typography variant="h6" fontWeight="bold">
                          {formatCurrency(item.price * item.quantity)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>

          {/* Shipping Information */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping color="primary" />
              Shipping Information
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>Delivery Address</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {order.shippingAddress.fullName}
                  </Typography>
                  <Typography variant="body2">{order.shippingAddress.addressLine1}</Typography>
                  {order.shippingAddress.addressLine2 && (
                    <Typography variant="body2">{order.shippingAddress.addressLine2}</Typography>
                  )}
                  <Typography variant="body2">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </Typography>
                  <Typography variant="body2">{order.shippingAddress.country}</Typography>
                  {order.shippingAddress.phone && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <Phone fontSize="small" /> {order.shippingAddress.phone}
                    </Typography>
                  )}
                </Box>
              </Grid>
              {order.trackingNumber && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: blue[50], borderRadius: 1, border: `1px solid ${blue[200]}` }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Tracking Information
                    </Typography>
                    <Typography variant="body1">
                      Tracking Number: <strong>{order.trackingNumber}</strong>
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Order Total & Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCard color="primary" />
              Order Total
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Subtotal:</TableCell>
                    <TableCell align="right">{formatCurrency(order.orderSummary.subtotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Delivery Fee:</TableCell>
                    <TableCell align="right">{formatCurrency(order.orderSummary.deliveryFee)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Service Fee:</TableCell>
                    <TableCell align="right">{formatCurrency(order.orderSummary.serviceFee)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tax:</TableCell>
                    <TableCell align="right">{formatCurrency(order.orderSummary.tax)}</TableCell>
                  </TableRow>
                  {order.orderSummary.tip > 0 && (
                    <TableRow>
                      <TableCell>Tip:</TableCell>
                      <TableCell align="right">{formatCurrency(order.orderSummary.tip)}</TableCell>
                    </TableRow>
                  )}
                  {order.orderSummary.discount > 0 && (
                    <TableRow>
                      <TableCell>Discount:</TableCell>
                      <TableCell align="right" sx={{ color: green[600] }}>
                        -{formatCurrency(order.orderSummary.discount)}
                      </TableCell>
                    </TableRow>
                  )}
                  {order.orderSummary.credits > 0 && (
                    <TableRow>
                      <TableCell>Credits Applied:</TableCell>
                      <TableCell align="right" sx={{ color: green[600] }}>
                        -{formatCurrency(order.orderSummary.credits)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell sx={{ borderTop: 2, borderColor: 'divider', pt: 2 }}>
                      <Typography variant="h6" fontWeight="bold">Total:</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderTop: 2, borderColor: 'divider', pt: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {formatCurrency(order.orderSummary.total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />

            {/* Invoice Section */}
            {invoice && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Receipt color="primary" />
                  Invoice
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Invoice Number: <strong>{invoice.invoiceNumber}</strong>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Invoice Date: {formatDate(invoice.invoiceDate)}
                </Typography>
                <Button
                  onClick={downloadInvoice}
                  variant="outlined"
                  startIcon={<Download />}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Download Invoice (PDF)
                </Button>
              </Box>
            )}

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                component={Link}
                to="/"
                variant="contained"
                size="large"
                startIcon={<Home />}
                fullWidth
              >
                Continue Shopping
              </Button>
              <Button
                component={Link}
                to="/orders"
                variant="outlined"
                size="large"
                startIcon={<ViewList />}
                fullWidth
              >
                View All Orders
              </Button>
            </Stack>
          </Paper>

          {/* Additional Information */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>What's Next?</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutline color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email confirmation sent"
                  secondary="Check your inbox for order details"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Schedule color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Tracking information"
                  secondary="We'll notify you when your order ships"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocalShipping color="info" />
                </ListItemIcon>
                <ListItemText 
                  primary="Estimated delivery"
                  secondary="3-5 business days"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Email color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Need help?"
                  secondary={
                    <Link to="/contact" style={{ textDecoration: 'none' }}>
                      Contact our support team
                    </Link>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderConfirmationPage;