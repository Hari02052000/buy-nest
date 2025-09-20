import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Alert,
  Grid,
} from "@mui/material";
import Header from "../components/global/Header";
import { useParams } from "react-router-dom";
import { getOrderById,editOrderById } from "../services/order.service"


function EditOrder() {
  const { orderId } = useParams();
  const[order,setOrder] = useState(null)
  const[error,setError] = useState()
  //const order = data?.order || null;
  const [paymentStatus, setPaymentStatus] = useState('');
  const [orderStatus, setOrderStatus] = useState("");
  const [transactionId, setTransactionId] = useState('');    
  useEffect(() => {
    const getOrder = async()=>{
          try {
            const response = await getOrderById(orderId)            
            if(response?.order) setOrder(response.order)
            else setError("order not get try again")
          } catch (error) {            
          }
    } 
    getOrder()
  }, []);
  
  useEffect(()=>{
     setPaymentStatus(order?.paymentInfo?.paymentStatus || "");
     setOrderStatus(order?.orderStatus || "");
     setTransactionId(order?.paymentInfo?.transactionId || "");
  },[order])
  if (!order) return;
  const isCancelled = order?.orderStatus === "cancelled";
  const isPayed = order?.paymentInfo?.paymentStatus === "completed";
  return (
    <Box m="20px" sx={{ maxWidth: 800, mx: "auto" }}>
      <Header title="Edit Order" subtitle="Manage the order details" />
      <Box
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid #ddd",
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" mb={2}>
          Order Info
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel sx={{ mb: 1 }}>Order ID</FormLabel>
          <TextField value={order.id} variant="filled" size="small" fullWidth disabled />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel sx={{ mb: 1 }}>User mail</FormLabel>
          <TextField value={`${order.user.email}`} variant="filled" size="small" fullWidth disabled />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel sx={{ mb: 1 }}>Shipping Address</FormLabel>
          <TextField
            value={`${order.address.addressLine1}, ${order.address.city}`}
            variant="filled"
            size="small"
            fullWidth
            multiline
            disabled
          />
        </FormControl>
      </Box>

      <Box
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid #ddd",
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" mb={2}>
          Ordered Items
        </Typography>

        <Grid container spacing={2}>
          {order.items.map((item) => (
            <Grid key={item.productId.id} item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={item.productId.images[0].url}
                  alt={item.productId.brandName}
                  sx={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                  }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    {item.productId.brandName}
                    {item.productId.modelName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Qty: {item.quantity}
                  </Typography>
                  <Typography variant="body2">Price: ${item.price}</Typography>
                  <Typography variant="body2">Total Price: ${item.totalPrice}</Typography>
                </Box>
              </Box>
              <Typography variant="h5">payableAmount: ${order.paymentInfo.payableAmount}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid #ddd",
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" mb={2}>
          Payment Details
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel sx={{ mb: 1 }}>Payment Method</FormLabel>
          <TextField value={order.paymentInfo.method} variant="filled" size="small" fullWidth disabled />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel sx={{ mb: 1 }}>Payment Status</FormLabel>
          <TextField
            value={order.paymentInfo.paymentStatus}
            variant="filled"
            size="small"
            fullWidth
            disabled
          />
        </FormControl>
      </Box>

      {!isCancelled ? (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={async (e) => {
            e.preventDefault();
            const isOrderStatusUpdate = order.orderStatus !== orderStatus
            const isPaymentStatusUpdate = order.paymentInfo.paymentStatus !== paymentStatus
            const isTransactionIdUpdate = transactionId.trim().length > 0 ? transactionId !==order.paymentInfo.transactionId : false 
            try {
              const response = await editOrderById(orderId,isOrderStatusUpdate?orderStatus:null,isPaymentStatusUpdate?paymentStatus:null,isTransactionIdUpdate?transactionId:null)
              if(response.order) setOrder(response.order)
            } catch (error) {
              
            }
          }}
          sx={{ p: 3, border: "1px solid #ddd", borderRadius: 1 }}
        >
         {
          order.paymentInfo.method === "cod" &&
          <>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ mb: 1 }}>Transaction ID</FormLabel>
            <TextField
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              variant="filled"
              size="small"
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ mb: 1 }}>Payment Status</FormLabel>
            <Select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              variant="filled"
              size="small"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          </>
           }
          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormLabel sx={{ mb: 1 }}>Order Status</FormLabel>
            <Select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              variant="filled"
              size="small"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
             <MenuItem value="cancelled">cancelled</MenuItem>
            </Select>
          </FormControl>
        {
          isPayed && 
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ mb: 1 }}>change status to refunded</FormLabel>
            <Select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              variant="filled"
              size="small"
            >
              <MenuItem value="refunded">Refunded</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
         }
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Save Changes
          </Button>
        </Box>
      ) : (
          <Alert severity="info" sx={{ p: 3 }}>
           This order is cancelled.
         </Alert>
      )}
    </Box>
  );
}

export default EditOrder;
