import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Tabs,
  Tab,
  Paper,
  Divider,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReplayIcon from "@mui/icons-material/Replay";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart } from "../store/slices/cartSlice";
import { addToWishlist } from "../store/slices/wishlistSlice";
import apiService from "../services/api";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "./hooks/useFetchData"

// Mock data
const hero = {
  title: "Season Sale",
  subtitle: "MEN'S FASHION",
  offer: "Min. 35-70% Off",
  cta1: "Shop Now",
  cta2: "Read More",
  image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
};

const highlights = [
  { icon: <LocalShippingIcon fontSize="large" color="primary" />, label: "Free Shipping" },
  { icon: <ReplayIcon fontSize="large" color="primary" />, label: "100% Money Back" },
  { icon: <SupportAgentIcon fontSize="large" color="primary" />, label: "Online Support" },
];

const promoBanners = [
  {
    label: "Handbag",
    discount: "25% Off",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Watch",
    discount: "45% Off",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Backpack",
    discount: "40% Off",
    image: "https://images.unsplash.com/photo-1517263904808-5dc0d6d4c08e?auto=format&fit=crop&w=600&q=80",
  },
];

const featuredTabs = [
  { label: "New Arrival", value: "new" },
  { label: "Best Selling", value: "best" },
  { label: "Top Rated", value: "top" },
];

const mockProducts = [
  {
    _id: "prod1",
    name: "iPhone 15 Pro",
    price: "999.00",
    category: "Electronics",
    images: [{ url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400" }],
    description: "Latest iPhone with advanced features",
  },
  {
    _id: "prod2",
    name: "MacBook Pro",
    price: "2499.00",
    category: "Electronics",
    images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" }],
    description: "Powerful laptop for professionals",
  },
  {
    _id: "prod3",
    name: "Nike Sneakers",
    price: "129.99",
    category: "Fashion",
    images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" }],
    description: "Comfortable running shoes",
  },
  {
    _id: "prod4",
    name: "Coffee Maker",
    price: "199.00",
    category: "Home",
    images: [{ url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400" }],
    description: "Premium coffee maker",
  },
];

const Home = () => {
  const [tab, setTab] = useState("new");
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Redux hooks
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const navigate = useNavigate();
  const [data,loading,error] = useFetchData("/product")  
  const products = data?.products || []
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const response = await apiService.getProducts(20, 0);                
  //       if (response.products) {
  //         setProducts(response.products);
  //       } else {
  //         console.log("Backend fetch failed, using mock products");
  //         setProducts(mockProducts);
  //       }
  //     } catch (err) {
  //       console.log("API call failed, using mock products as fallback");
  //       setProducts(mockProducts);
  //       setError(null); // Clear error since we have fallback data
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  // const handleAddToCart = async (productId, event) => {
  //   event.stopPropagation();
  //   if (!isAuthenticated) {
  //     setSnackbar({ open: true, message: "Please login to add items to cart", severity: "warning" });
  //     return;
  //   }

  //   setActionLoading((prev) => ({ ...prev, [`cart-${productId}`]: true }));
  //   try {
  //     const result = await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
  //     setSnackbar({ open: true, message: "Added to cart successfully!", severity: "success" });
  //   } catch (error) {
  //     setSnackbar({ open: true, message: "Failed to add to cart", severity: "error" });
  //   } finally {
  //     setActionLoading((prev) => ({ ...prev, [`cart-${productId}`]: false }));
  //   }
  // };

  // const handleAddToWishlist = async (productId, event) => {
  //   event.stopPropagation();
  //   if (!isAuthenticated) {
  //     setSnackbar({ open: true, message: "Please login to add items to wishlist", severity: "warning" });
  //     return;
  //   }

  //   setActionLoading((prev) => ({ ...prev, [`wishlist-${productId}`]: true }));
  //   try {
  //     const result = await dispatch(addToWishlist(productId)).unwrap();
  //     setSnackbar({ open: true, message: "Added to wishlist successfully!", severity: "success" });
  //   } catch (error) {
  //     setSnackbar({ open: true, message: "Failed to add to wishlist", severity: "error" });
  //   } finally {
  //     setActionLoading((prev) => ({ ...prev, [`wishlist-${productId}`]: false }));
  //   }
  // };

  // const isInWishlist = (productId) => {
  //   return wishlistItems.some((item) => item.productId === productId);
  // };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
    arrows: true, // Use default arrows
  };

  return (
    <>
      <Box sx={{ background: "#fafbfc", minHeight: "100vh" }}>
        {/* Hero Section */}
        <Box sx={{ background: "white", py: { xs: 4, md: 8 }, px: 2 }}>
          <Container maxWidth={false} sx={{ px: { xs: 1, sm: 3, md: 8, lg: 16 } }}>
            <Grid container spacing={6} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={6} lg={5}>
                <Typography variant="h5" color="primary" fontWeight={700} sx={{ mb: 1 }}>
                  {hero.title}
                </Typography>
                <Typography variant="h2" fontWeight={900} sx={{ mb: 1 }}>
                  {hero.subtitle}
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
                  {hero.offer}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate("/products")}
                  >
                    {hero.cta1}
                  </Button>
                  <Button variant="outlined" color="primary" size="large">
                    {hero.cta2}
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={5} sx={{ textAlign: "center" }}>
                <img
                  src={hero.image}
                  alt="Hero"
                  style={{
                    width: "100%",
                    maxWidth: 420,
                    borderRadius: 24,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
        {/* Service Highlights */}
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 1, sm: 3, md: 8, lg: 16 } }}>
          <Grid container spacing={4} justifyContent="center">
            {highlights.map((h, i) => (
              <Grid item xs={12} sm={4} md={4} key={i} sx={{ textAlign: "center" }}>
                <Box>{h.icon}</Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {h.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
        {/* Promo Banners */}
        <Container maxWidth={false} sx={{ py: 2, px: { xs: 1, sm: 3, md: 8, lg: 16 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#f5f5f5",
                  p: 2,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
                  alt="Women's Style"
                  style={{ width: "100%", borderRadius: 12, marginBottom: 8 }}
                />
                <Typography variant="h6" fontWeight={700}>
                  Women's Style
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Up to 70% Off
                </Typography>
              </Card>
            </Grid>
            {promoBanners.map((b, i) => (
              <Grid item xs={12} md={2} lg={2} key={i}>
                <Card
                  sx={{
                    height: "100%",
                    background: "#f5f5f5",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={b.image}
                    alt={b.label}
                    style={{ width: "100%", borderRadius: 12, marginBottom: 8 }}
                  />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {b.label}
                  </Typography>
                  <Chip label={b.discount} color="primary" size="small" sx={{ mt: 1 }} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        {/* Featured Products with Tabs as Carousel */}
        <Container maxWidth={false} sx={{ py: 6, px: { xs: 1, sm: 3, md: 8, lg: 16 } }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            Featured Products
          </Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            {featuredTabs.map((t) => (
              <Tab key={t.value} value={t.value} label={t.label} />
            ))}
          </Tabs>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : products.length > 0 ? (
            <Box sx={{ width: "100%" }}>
              <Slider {...sliderSettings}>
                {products.map((product) => <ProductCard key={product.id} product={product}/>)}
                </Slider>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No products available
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
