import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import Header from "./Header";
import Footer from "./Footer";
import { getAddress, createAddress } from "../services/address.service";
import { createOrder,verifyOnlinePayment } from "../services/order.service";
import PaymentModal from "./components/PaymentForm";
import OrderSuccessModal from "./components/OrderSuccessModal";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/slices/cartSlice"

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems, totalAmount } = useAppSelector((state) => state.cart);
  const [addresses, setAddresses] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const fullNameRef = useRef();
  const addressLine1Ref = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const zipCodeRef = useRef();
  const phoneRef = useRef();
  const countryRef = useRef();
  const couponRef = useRef();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const[selectedPaymentMethod,setSelectedPaymentMethod] = useState("")
  const [error, setError] = useState("");
  const [stripeClientSecret, setStripeClientSecret] = useState("");
  const [openPayment, setOpenPayment] = React.useState(false);
  const [orderId, setOrderId] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState({
    isApplied: false,
    couponId: null,
    discount: null,
  });
   async function handleSuccess(paymentIntentId){
      console.log(paymentIntentId);
      const response = await verifyOnlinePayment(paymentIntentId)  
      if(response?.order){
        dispatch(clearCart())
        setOrderModalOpen(true)
      }
     console.log("verified response");
   }
   function handleError(err){
    setError(err.message)
    setOpenPayment(false)
   }

  useEffect(() => {
    async function fetechAddress() {
      try {
        const response = await getAddress();
        if (response.address) {
          setAddresses(response.address);
        } else setError("address not fetch");
      } catch (error) {
        setError(error.message || "address not fetch");
      }
    }
    if (!isAuthenticated) {
      navigate("/login");
    } else fetechAddress();
  }, [isAuthenticated]);

  const handleApplyCoupon = () => {
    const coupon = couponRef.current.value;
    console.log(coupon);
  };
  const handleNewAddressSubmit = async () => {
    setError("");
    try {
      const newAddress = {
        fullName: fullNameRef.current.value,
        addressLine1: addressLine1Ref.current.value,
        city: cityRef.current.value,
        state: stateRef.current.value,
        zipCode: zipCodeRef.current.value,
        phone: phoneRef.current.value,
        country: countryRef.current.value,
      };
      const response = await createAddress(newAddress);
      if (response.address) {
        setAddresses((prev) => [...prev, response.address]);
      } else setError("address not added");
    } catch (error) {
      setError(error.message || "address not added");
    }
  };

  const handlePlaceOrder = async() => {
    setError("");
    console.log(selectedAddressId);

    if (!selectedAddressId) {
      setError("Please select an address");
      return;
    }
    if (!selectedPaymentMethod) {
      setError("please select a payment option");
      return;
    }
    const orderDetailas = { 
     addressId : selectedAddressId,
     paymentMethod : selectedPaymentMethod,
     coupon : {
     isApplied: appliedCoupon.isApplied,
     couponId: appliedCoupon.couponId ? appliedCoupon.couponId : "",
     discount: appliedCoupon.discount ? appliedCoupon.discount : "",
    }
  }
  const response = await createOrder(orderDetailas)
  console.log(response);
  if(selectedPaymentMethod === "online" && response?.order?.publish_key && response?.order?.secret && response?.order?.amount && response?.order?.orderId){
    setStripeClientSecret(response.order.secret)
    setOrderId(response.order.orderId)
    setOpenPayment(true)
  }
  if(selectedPaymentMethod === "cod" && response?.order?.id){
    dispatch(clearCart())
    setOrderModalOpen(true)
  }
  };

  return (
    <>
      <Box sx={{ background: "#f8f5f2", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
            Checkout
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Shipping Address
                </Typography>

                {addresses.length > 0 && !showNewAddressForm ? (
                  <>
                    <RadioGroup value={selectedAddressId} onChange={(e)=>setSelectedAddressId(e.target.value)}>
                      {addresses.map((addr) => (
                        <FormControlLabel
                          key={addr.id}
                          value={addr.id}
                          control={<Radio />}
                          label={`${addr.fullName}, ${addr.addressLine1}, ${addr.city}, ${addr.state}, ${addr.zipCode}`}
                        />
                      ))}
                    </RadioGroup>
                    <Button onClick={() => setShowNewAddressForm(true)} sx={{ mt: 2 }}>
                      Add New Address
                    </Button>
                  </>
                ) : (
                  <>
                    <Grid container spacing={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField fullWidth label="Full Name" inputRef={fullNameRef} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth label="Address Line 1" inputRef={addressLine1Ref} />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField fullWidth label="City" inputRef={cityRef} />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField fullWidth label="State" inputRef={stateRef} />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField fullWidth label="Zip Code" inputRef={zipCodeRef} />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField fullWidth label="Phone" inputRef={phoneRef} />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField fullWidth label="Country" inputRef={countryRef} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      <Button variant="contained" onClick={handleNewAddressSubmit}>
                        Save Address
                      </Button>
                      <Button sx={{ ml: 2 }} onClick={() => setShowNewAddressForm(false)}>
                        Cancel
                      </Button>
                    </Box>
                  </>
                )}
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Payment Method
                </Typography>
                <RadioGroup value={selectedPaymentMethod} onChange={(e)=>setSelectedPaymentMethod(e.target.value)}>
                  <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery (COD)" />
                  <FormControlLabel value="online" control={<Radio />} label="Online Payment" />
                </RadioGroup>
              </Paper>
              {/* <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Apply Coupon
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField label="Coupon Code" fullWidth inputRef={couponRef} />
                  <Button variant="contained" onClick={() => handleApplyCoupon()}>
                    Apply
                  </Button>
                </Box>
              </Paper> */}

              <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" size="large" fullWidth onClick={handlePlaceOrder}>
                  Order Now
                </Button>
              </Box>
            </Grid>

            {/* Right - Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Order Summary
                </Typography>
                {cartItems.map((item, i) => (
                  <Box key={i} sx={{ display: "flex", mb: 2 }}>
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      style={{ width: 50, height: 50, objectFit: "cover", marginRight: 12 }}
                    />
                    <Box>
                      <Typography fontWeight={600}>{item.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity} × ${item.price}
                      </Typography>
                    </Box>
                    <Box sx={{ marginLeft: "auto" }}>
                      <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${totalAmount}</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {stripeClientSecret && openPayment &&
      <PaymentModal
      open={openPayment}
      onClose={() => setOpenPayment(false)}
      clientSecret={stripeClientSecret}
      onSuccess={handleSuccess}
      onError={handleError}
    />
      }
      {
        orderModalOpen && <OrderSuccessModal
        open={orderModalOpen}
        onClose={()=>setOrderModalOpen(false)}
        />
      }

    {error && <Typography color="error">{error}</Typography>}

    </>
  );
};

export default CheckoutPage;
