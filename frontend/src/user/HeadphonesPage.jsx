import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  Snackbar,
  InputAdornment,
  Breadcrumbs,
  Link,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

const HeadphonesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (typeof price === "string") {
      return price.startsWith("$") ? price : `$${price}`;
    }
    return `$${price?.toFixed(2) || "0.00"}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.getProducts(50, 0);
        if (response.success && response.data) {
          const productsData = response.data;
          const filteredProducts = productsData.filter((product) => {
            const matchesCategory =
              product.subcategory?.toLowerCase() === "headphones" ||
              product.name?.toLowerCase().includes("headphones") ||
              product.name?.toLowerCase().includes("earbuds") ||
              product.name?.toLowerCase().includes("headset") ||
              product.name?.toLowerCase().includes("audio") ||
              product.description?.toLowerCase().includes("headphones") ||
              product.description?.toLowerCase().includes("audio");
            return matchesCategory;
          });
          setProducts(filteredProducts);
        } else {
          // Mock data for headphones
          const mockProducts = [
            {
              _id: "head1",
              name: "Sony WH-1000XM5",
              price: 399,
              category: "Electronics",
              subcategory: "headphones",
              images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" }],
              description: "Noise-canceling wireless headphones",
            },
            {
              _id: "head2",
              name: "Apple AirPods Pro",
              price: 249,
              category: "Electronics",
              subcategory: "headphones",
              images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" }],
              description: "Premium wireless earbuds",
            },
            {
              _id: "head3",
              name: "Bose QuietComfort",
              price: 329,
              category: "Electronics",
              subcategory: "headphones",
              images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" }],
              description: "Comfortable noise-canceling headphones",
            },
          ];
          setProducts(mockProducts);
        }
      } catch (err) {
        const mockProducts = [
          {
            _id: "head1",
            name: "Sony WH-1000XM5",
            price: 399,
            category: "Electronics",
            subcategory: "headphones",
            images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" }],
            description: "Noise-canceling wireless headphones",
          },
          {
            _id: "head2",
            name: "Apple AirPods Pro",
            price: 249,
            category: "Electronics",
            subcategory: "headphones",
            images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" }],
            description: "Premium wireless earbuds",
          },
          {
            _id: "head3",
            name: "Bose QuietComfort",
            price: 329,
            category: "Electronics",
            subcategory: "headphones",
            images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" }],
            description: "Comfortable noise-canceling headphones",
          },
        ];
        setProducts(mockProducts);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: "Please login to add items to cart", severity: "warning" });
      return;
    }

    setActionLoading((prev) => ({ ...prev, [`cart-${productId}`]: true }));
    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        setSnackbar({ open: true, message: "Added to cart successfully!", severity: "success" });
      } else {
        setSnackbar({ open: true, message: result.message || "Failed to add to cart", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to add to cart", severity: "error" });
    } finally {
      setActionLoading((prev) => ({ ...prev, [`cart-${productId}`]: false }));
    }
  };

  const handleAddToWishlist = async (productId, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: "Please login to add items to wishlist", severity: "warning" });
      return;
    }

    setActionLoading((prev) => ({ ...prev, [`wishlist-${productId}`]: true }));
    try {
      const result = await addToWishlist(productId);
      if (result.success) {
        setSnackbar({ open: true, message: "Added to wishlist successfully!", severity: "success" });
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Failed to add to wishlist",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to add to wishlist", severity: "error" });
    } finally {
      setActionLoading((prev) => ({ ...prev, [`wishlist-${productId}`]: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isInWishlist = (productId) => {
    return wishlist?.items?.some((item) => item.productId === productId) || false;
  };

  const filteredProducts = products.filter((product) => {
    return (
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <Header />
      <Box sx={{ background: "#fafbfc", minHeight: "100vh" }}>
        {/* Breadcrumbs */}
        <Container maxWidth="xl" sx={{ pt: 2, px: { xs: 2, sm: 3, md: 4 } }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              component={RouterLink}
              to="/"
              sx={{ display: "flex", alignItems: "center" }}
              color="inherit"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Link component={RouterLink} to="/products" color="inherit">
              Products
            </Link>
            <Typography color="text.primary">Headphones</Typography>
          </Breadcrumbs>
        </Container>

        {/* Category Header */}
        <Box sx={{ backgroundColor: "primary.main", py: 6, mb: 4, color: "primary.contrastText" }}>
          <Container maxWidth="xl">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h2"
                  fontWeight={700}
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <span style={{ fontSize: "3rem" }}>🎧</span>
                  Headphones
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                  Headphones, earbuds, and audio accessories
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Search Section */}
        <Container maxWidth="xl" sx={{ mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <TextField
              placeholder="Search headphones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: { xs: "100%", sm: "500px", md: "600px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  backgroundColor: "white",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Container>

        {/* Loading/Error State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
            {filteredProducts.length > 0 ? (
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {filteredProducts.map((product) => (
                  <Grid item xs={6} sm={4} md={3} lg={2.4} key={product._id || product.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: 2,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                      }}
                      onClick={() => navigate(`/products/${product._id || product.id}`)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={
                          product.images?.[0]?.url || "https://via.placeholder.com/400x300?text=No+Image"
                        }
                        alt={product.name}
                      />
                      <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            minHeight: "2.4em",
                            mb: 1,
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {product.description}
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight={600}>
                          {formatPrice(product.price)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={(e) => handleAddToWishlist(product._id || product.id, e)}
                          disabled={actionLoading[`wishlist-${product._id || product.id}`]}
                        >
                          {isInWishlist(product._id || product.id) ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                        <Button
                          size="small"
                          variant="contained"
                          endIcon={<ShoppingCartIcon />}
                          onClick={(e) => handleAddToCart(product._id || product.id, e)}
                          disabled={actionLoading[`cart-${product._id || product.id}`]}
                          sx={{ ml: "auto" }}
                        >
                          {actionLoading[`cart-${product._id || product.id}`] ? "Adding..." : "Add to Cart"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No headphones found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {searchTerm
                    ? `No headphones match "${searchTerm}"`
                    : "No headphones available at the moment"}
                </Typography>
                {searchTerm && (
                  <Button variant="outlined" size="large" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                )}
              </Box>
            )}
          </Container>
        )}
      </Box>
      <Footer />

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

export default HeadphonesPage;
