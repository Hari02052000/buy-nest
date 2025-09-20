import React, { useEffect, useState, useMemo } from "react";
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
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Chip,
  Rating,
  Stack,
  Paper,
} from "@mui/material";
import Carousel from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

const FashionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  const navigate = useNavigate();

  // Carousel settings for featured products
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Carousel styles
  const carouselStyles = {
    ".slick-dots": {
      bottom: "10px",
    },
    ".slick-dots li button:before": {
      fontSize: "12px",
      color: "white",
    },
    ".slick-dots li.slick-active button:before": {
      color: "white",
    },
    ".slick-slide": {
      padding: "0 10px",
    },
  };

  const formatPrice = (price) => {
    if (typeof price === "string") {
      return price.startsWith("$") ? price : `$${price}`;
    }
    return `$${price?.toFixed(2) || "0.00"}`;
  };

  // Fetch fashion & clothing products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts(50, 0);
        if (response.success && response.data) {
          const filtered = response.data.filter((p) =>
            ["fashion", "clothing", "shoes", "accessories", "jewelry", "watches", "bags"].includes(
              p.subcategory?.toLowerCase() || p.category?.toLowerCase(),
            ),
          );
          setProducts(filtered);
        } else {
          console.log("Backend fetch failed, using mock products");
          // Create mock fashion products
          const mockFashionProducts = [
            {
              _id: "fashion1",
              name: "Designer Leather Jacket",
              description: "Premium leather jacket with modern styling",
              price: "299.99",
              brand: "Calvin Klein",
              subcategory: "clothing",
              images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" }],
            },
            {
              _id: "fashion2",
              name: "Luxury Watch",
              description: "Stainless steel automatic watch with sapphire crystal",
              price: "499.99",
              brand: "Seiko",
              subcategory: "watches",
              images: [{ url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500" }],
            },
            {
              _id: "fashion3",
              name: "Designer Handbag",
              description: "Elegant leather handbag with gold-tone hardware",
              price: "349.99",
              brand: "Michael Kors",
              subcategory: "bags",
              images: [{ url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500" }],
            },
            {
              _id: "fashion4",
              name: "Running Shoes",
              description: "Lightweight performance running shoes with cushioned sole",
              price: "129.99",
              brand: "Adidas",
              subcategory: "shoes",
              images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" }],
            },
          ];
          setProducts(mockFashionProducts);
        }
      } catch (err) {
        console.log("API call failed, using mock products as fallback");
        // Create mock fashion products
        const mockFashionProducts = [
          {
            _id: "fashion1",
            name: "Designer Leather Jacket",
            description: "Premium leather jacket with modern styling",
            price: "299.99",
            brand: "Calvin Klein",
            subcategory: "clothing",
            images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" }],
          },
          {
            _id: "fashion2",
            name: "Luxury Watch",
            description: "Stainless steel automatic watch with sapphire crystal",
            price: "499.99",
            brand: "Seiko",
            subcategory: "watches",
            images: [{ url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500" }],
          },
          {
            _id: "fashion3",
            name: "Designer Handbag",
            description: "Elegant leather handbag with gold-tone hardware",
            price: "349.99",
            brand: "Michael Kors",
            subcategory: "bags",
            images: [{ url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500" }],
          },
          {
            _id: "fashion4",
            name: "Running Shoes",
            description: "Lightweight performance running shoes with cushioned sole",
            price: "129.99",
            brand: "Adidas",
            subcategory: "shoes",
            images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" }],
          },
        ];
        setProducts(mockFashionProducts);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle add to cart
  const handleAddToCart = async (productId, event) => {
    if (event) event.stopPropagation();

    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: "Please log in to add items to your cart",
        severity: "info",
      });
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [`cart-${productId}`]: true }));
      const result = await addToCart(productId, 1);
      if (result.success) {
        setSnackbar({
          open: true,
          message: "Product added to cart successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Failed to add product to cart",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [`cart-${productId}`]: false }));
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = async (productId, event) => {
    if (event) event.stopPropagation();

    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: "Please log in to add items to your wishlist",
        severity: "info",
      });
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [`wishlist-${productId}`]: true }));
      const result = await addToWishlist(productId);
      if (result.success) {
        setSnackbar({
          open: true,
          message: isInWishlist(productId) ? "Product removed from wishlist" : "Product added to wishlist",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Failed to update wishlist",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [products, searchTerm]);

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
            <Typography color="text.primary">Fashion & Clothing</Typography>
          </Breadcrumbs>
        </Container>

        {/* Category Header */}
        <Box sx={{ backgroundColor: "primary.main", py: 6, mb: 4, color: "primary.contrastText" }}>
          <Container maxWidth="xl">
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Fashion & Clothing
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Discover the latest trends in fashion and accessories
            </Typography>
            <TextField
              placeholder="Search fashion products..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                maxWidth: 600,
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Container>
        </Box>

        {/* Featured Products Carousel */}
        <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: "primary.main" }}>
            Featured Fashion
          </Typography>
          <Box sx={{ ...carouselStyles }}>
            <Carousel {...carouselSettings}>
              {products.slice(0, 5).map((product) => (
                <Box
                  key={product._id || product.id}
                  onClick={() => navigate(`/products/${product._id || product.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <Paper
                    sx={{
                      position: "relative",
                      height: { xs: 200, sm: 300, md: 400 },
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${product.images?.[0]?.url || "https://via.placeholder.com/400x300"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      p: 3,
                      color: "white",
                    }}
                  >
                    <Box sx={{ zIndex: 1 }}>
                      <Typography variant="h4" fontWeight={700} gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                        {product.description}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Rating
                            value={product.rating || 0}
                            readOnly
                            size="small"
                            sx={{
                              "& .MuiRating-iconFilled": { color: "white" },
                              "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.5)" },
                            }}
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({product.rating || 0})
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          {formatPrice(product.price)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", mt: 2 }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={(e) => handleAddToCart(product._id || product.id, e)}
                          disabled={actionLoading[`cart-${product._id || product.id}`]}
                        >
                          Add to Cart
                        </Button>
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={(e) => handleAddToWishlist(product._id || product.id, e)}
                          disabled={actionLoading[`wishlist-${product._id || product.id}`]}
                          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
                        >
                          {isInWishlist(product._id || product.id) ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Carousel>
          </Box>
        </Container>

        {/* Products Grid */}
        <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: "primary.main" }}>
            All Fashion & Clothing Products
          </Typography>

          {/* Loading/Error State */}
          {loading ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading products...</Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          ) : filteredProducts.length === 0 ? (
            <Alert severity="info" sx={{ mb: 4 }}>
              No products found matching your criteria.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || product.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => navigate(`/products/${product._id || product.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images?.[0]?.url || "https://via.placeholder.com/300x200"}
                      alt={product.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          mb: 1,
                          height: "40px",
                        }}
                      >
                        {product.description}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Rating value={product.rating || 0} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({product.rating || 0})
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary" fontWeight={600}>
                        {formatPrice(product.price)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCartIcon />}
                        onClick={(e) => handleAddToCart(product._id || product.id, e)}
                        disabled={actionLoading[`cart-${product._id || product.id}`]}
                      >
                        Add to Cart
                      </Button>
                      <IconButton
                        color="primary"
                        onClick={(e) => handleAddToWishlist(product._id || product.id, e)}
                        disabled={actionLoading[`wishlist-${product._id || product.id}`]}
                      >
                        {isInWishlist(product._id || product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {/* Category Navigation Cards */}
        <Container maxWidth="xl" sx={{ mb: 8, px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: "primary.main" }}>
            Browse Fashion Categories
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
                onClick={() => navigate("/clothing")}
              >
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    👕
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Clothing
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
                onClick={() => navigate("/shoes")}
              >
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    👟
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Shoes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
                onClick={() => navigate("/jewelry")}
              >
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    💍
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Jewelry
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
                onClick={() => navigate("/watches")}
              >
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    ⌚
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Watches
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
                onClick={() => navigate("/bags")}
              >
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    👜
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Bags
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
                onClick={() => navigate("/beauty")}
              >
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    💄
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Beauty
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
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

export default FashionPage;
