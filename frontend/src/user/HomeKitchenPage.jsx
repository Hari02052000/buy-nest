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
  Chip,
  Rating,
  Paper,
  MenuItem,
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

const HomeKitchenPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  const navigate = useNavigate();

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const carouselStyles = {
    ".slick-dots": { bottom: "10px" },
    ".slick-dots li button:before": { fontSize: "12px", color: "white" },
    ".slick-dots li.slick-active button:before": { color: "white" },
    ".slick-slide": { padding: "0 10px" },
  };

  const formatPrice = (price) =>
    typeof price === "string"
      ? price.startsWith("$")
        ? price
        : `$${price}`
      : `$${price?.toFixed(2) || "0.00"}`;

  const brands = useMemo(() => {
    const setB = new Set();
    products.forEach((p) => p.brand && setB.add(p.brand));
    return Array.from(setB).sort();
  }, [products]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handlePriceChange = (_, val) => setPriceRange(val);
  const handleSortChange = (e) => setSortBy(e.target.value);
  const handleClearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 2000]);
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSortBy("featured");
  };

  const handleAddToCart = async (id, e) => {
    e?.stopPropagation();
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: "Please log in to add to cart", severity: "info" });
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, [`cart-${id}`]: true }));
      const res = await addToCart(id, 1);
      setSnackbar({
        open: true,
        message: res.success ? "Product added to cart" : res.message || "Failed to add",
        severity: res.success ? "success" : "error",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [`cart-${id}`]: false }));
    }
  };

  const handleAddToWishlist = async (id, e) => {
    e?.stopPropagation();
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: "Please log in to add to wishlist", severity: "info" });
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, [`wishlist-${id}`]: true }));
      const res = await addToWishlist(id);
      setSnackbar({
        open: true,
        message: isInWishlist(id) ? "Removed from wishlist" : "Added to wishlist",
        severity: res.success ? "success" : "error",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [`wishlist-${id}`]: false }));
    }
  };

  const isInWishlist = (id) => wishlist?.items?.some((i) => i.productId === id);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts(50, 0);
        if (response.success && response.data) {
          const filtered = response.data.filter((p) =>
            ["home", "furniture", "home-decor", "kitchen", "bedding", "garden", "tools"].includes(
              p.subcategory?.toLowerCase() || p.category?.toLowerCase(),
            ),
          );
          setProducts(filtered);
        } else {
          console.log("Backend fetch failed, using mock products");
          // Create mock home & kitchen products
          const mockHomeProducts = [
            {
              _id: "home1",
              name: "Modern Coffee Table",
              description: "Sleek coffee table with storage compartment",
              price: "249.99",
              brand: "IKEA",
              subcategory: "furniture",
              images: [{ url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500" }],
            },
            {
              _id: "home2",
              name: "Stainless Steel Cookware Set",
              description: "10-piece cookware set for all your cooking needs",
              price: "199.99",
              brand: "Cuisinart",
              subcategory: "kitchen",
              images: [{ url: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500" }],
            },
            {
              _id: "home3",
              name: "Luxury Bedding Set",
              description: "Egyptian cotton bedding set with duvet cover and pillowcases",
              price: "129.99",
              brand: "Brooklinen",
              subcategory: "bedding",
              images: [{ url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500" }],
            },
            {
              _id: "home4",
              name: "Indoor Plant Collection",
              description: "Set of 3 low-maintenance indoor plants",
              price: "89.99",
              brand: "Plants.com",
              subcategory: "home-decor",
              images: [{ url: "https://images.unsplash.com/photo-1545165375-1b744b9ed444?w=500" }],
            },
          ];
          setProducts(mockHomeProducts);
        }
      } catch (err) {
        console.log("API call failed, using mock products as fallback");
        // Create mock home & kitchen products
        const mockHomeProducts = [
          {
            _id: "home1",
            name: "Modern Coffee Table",
            description: "Sleek coffee table with storage compartment",
            price: "249.99",
            brand: "IKEA",
            subcategory: "furniture",
            images: [{ url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500" }],
          },
          {
            _id: "home2",
            name: "Stainless Steel Cookware Set",
            description: "10-piece cookware set for all your cooking needs",
            price: "199.99",
            brand: "Cuisinart",
            subcategory: "kitchen",
            images: [{ url: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500" }],
          },
          {
            _id: "home3",
            name: "Luxury Bedding Set",
            description: "Egyptian cotton bedding set with duvet cover and pillowcases",
            price: "129.99",
            brand: "Brooklinen",
            subcategory: "bedding",
            images: [{ url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500" }],
          },
          {
            _id: "home4",
            name: "Indoor Plant Collection",
            description: "Set of 3 low-maintenance indoor plants",
            price: "89.99",
            brand: "Plants.com",
            subcategory: "home-decor",
            images: [{ url: "https://images.unsplash.com/photo-1545165375-1b744b9ed444?w=500" }],
          },
        ];
        setProducts(mockHomeProducts);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const price = typeof p.price === "string" ? parseFloat(p.price.replace(/[^0-9.-]+/g, "")) : p.price;
      return (
        (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        price >= priceRange[0] &&
        price <= priceRange[1] &&
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
        (selectedTypes.length === 0 || selectedTypes.includes(p.subcategory))
      );
    });
  }, [products, searchTerm, priceRange, selectedBrands, selectedTypes]);

  return (
    <>
      <Header />
      <Box sx={{ background: "#fafbfc", minHeight: "100vh" }}>
        {/* Breadcrumbs */}
        <Container sx={{ pt: 2 }}>
          <Breadcrumbs>
            <Link component={RouterLink} to="/" color="inherit">
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Home
            </Link>
            <Link component={RouterLink} to="/products" color="inherit">
              Products
            </Link>
            <Typography color="text.primary">Home & Kitchen</Typography>
          </Breadcrumbs>
        </Container>

        {/* Header */}
        <Box sx={{ backgroundColor: "primary.main", py: 6, color: "white" }}>
          <Container>
            <Typography variant="h3" fontWeight={700}>
              Home & Kitchen
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Discover stylish furniture, decor, and kitchen essentials
            </Typography>
            <TextField
              placeholder="Search..."
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 600, backgroundColor: "white", borderRadius: 1 }}
            />
          </Container>
        </Box>

        {/* Products */}
        <Container sx={{ py: 4 }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={p.images?.[0]?.url || "https://via.placeholder.com/200"}
                      alt={p.name}
                      onClick={() => navigate(`/products/${p._id}`)}
                      sx={{ cursor: "pointer" }}
                    />
                    <CardContent>
                      <Typography variant="h6">{p.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {p.description}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatPrice(p.price)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button startIcon={<ShoppingCartIcon />} onClick={(e) => handleAddToCart(p._id, e)}>
                        Add to Cart
                      </Button>
                      <IconButton onClick={(e) => handleAddToWishlist(p._id, e)}>
                        {isInWishlist(p._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default HomeKitchenPage;
