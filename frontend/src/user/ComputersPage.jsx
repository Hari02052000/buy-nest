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

const ComputersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  const navigate = useNavigate();

  // Carousel settings
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
              product.subcategory?.toLowerCase() === "computers" ||
              product.name?.toLowerCase().includes("computer") ||
              product.name?.toLowerCase().includes("desktop") ||
              product.name?.toLowerCase().includes("pc") ||
              product.name?.toLowerCase().includes("workstation") ||
              product.description?.toLowerCase().includes("computer") ||
              product.description?.toLowerCase().includes("desktop");
            return matchesCategory;
          });
          setProducts(filteredProducts);

          // Set featured products (top 3 highest rated)
          const featured = [...filteredProducts]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);
          setFeaturedProducts(featured);
        } else {
          // Mock data for computers
          const mockProducts = [
            {
              _id: "comp1",
              name: "Dell XPS Desktop",
              price: 1299,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400" }],
              description: "High-performance desktop computer with Intel Core i7, 16GB RAM, 1TB SSD",
              rating: 4.7,
              stock: 15,
            },
            {
              _id: "comp2",
              name: "HP Pavilion Desktop",
              price: 899,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400" }],
              description: "Reliable desktop for everyday use with AMD Ryzen 5, 8GB RAM, 512GB SSD",
              rating: 4.3,
              stock: 22,
            },
            {
              _id: "comp3",
              name: "Gaming PC Build",
              price: 1899,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400" }],
              description: "Custom gaming desktop computer with RTX 4070, Intel i9, 32GB RAM",
              rating: 4.9,
              stock: 7,
            },
            {
              _id: "comp4",
              name: "Apple Mac Mini M2",
              price: 699,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400" }],
              description: "Compact desktop with Apple M2 chip, 8GB RAM, 256GB SSD",
              rating: 4.6,
              stock: 18,
            },
            {
              _id: "comp5",
              name: "Lenovo ThinkCentre",
              price: 749,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=400" }],
              description: "Business desktop with Intel Core i5, 16GB RAM, 512GB SSD",
              rating: 4.2,
              stock: 25,
            },
            {
              _id: "comp6",
              name: "ASUS ROG Gaming Desktop",
              price: 2199,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400" }],
              description: "Premium gaming PC with RTX 4080, AMD Ryzen 9, 64GB RAM",
              rating: 4.8,
              stock: 5,
            },
            {
              _id: "comp7",
              name: "Microsoft Surface Studio",
              price: 3499,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400" }],
              description: "All-in-one desktop with touchscreen display, Intel i7, 32GB RAM",
              rating: 4.5,
              stock: 3,
            },
            {
              _id: "comp8",
              name: "CyberPowerPC Gamer Supreme",
              price: 1599,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400" }],
              description: "Mid-range gaming PC with RTX 3070, AMD Ryzen 7, 16GB RAM",
              rating: 4.4,
              stock: 12,
            },
            {
              _id: "comp9",
              name: "Intel NUC Mini PC",
              price: 649,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?w=400" }],
              description: "Ultra-compact desktop for office and home use, Intel i5, 8GB RAM",
              rating: 4.1,
              stock: 20,
            },
            {
              _id: "comp10",
              name: "Alienware Aurora R15",
              price: 2499,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400" }],
              description: "High-end gaming desktop with liquid cooling, RTX 4090, 64GB RAM",
              rating: 4.9,
              stock: 2,
            },
            {
              _id: "comp11",
              name: "Apple iMac 24-inch",
              price: 1499,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400" }],
              description: "Sleek all-in-one desktop with M1 chip, 8GB RAM, 512GB SSD",
              rating: 4.7,
              stock: 9,
            },
            {
              _id: "comp12",
              name: "MSI Aegis RS Gaming Desktop",
              price: 1799,
              category: "Electronics",
              subcategory: "computers",
              images: [{ url: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400" }],
              description: "Gaming desktop with RGB lighting, RTX 3080, Intel i7, 32GB RAM",
              rating: 4.5,
              stock: 8,
            },
          ];
          setProducts(mockProducts);

          // Set featured products (top 3 highest rated)
          const featured = [...mockProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
          setFeaturedProducts(featured);
        }
      } catch (err) {
        const mockProducts = [
          {
            _id: "comp1",
            name: "Dell XPS Desktop",
            price: 1299,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400" }],
            description: "High-performance desktop computer with Intel Core i7, 16GB RAM, 1TB SSD",
            rating: 4.7,
            stock: 15,
          },
          {
            _id: "comp2",
            name: "HP Pavilion Desktop",
            price: 899,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400" }],
            description: "Reliable desktop for everyday use with AMD Ryzen 5, 8GB RAM, 512GB SSD",
            rating: 4.3,
            stock: 22,
          },
          {
            _id: "comp3",
            name: "Gaming PC Build",
            price: 1899,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400" }],
            description: "Custom gaming desktop computer with RTX 4070, Intel i9, 32GB RAM",
            rating: 4.9,
            stock: 7,
          },
          {
            _id: "comp4",
            name: "Apple Mac Mini M2",
            price: 699,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400" }],
            description: "Compact desktop with Apple M2 chip, 8GB RAM, 256GB SSD",
            rating: 4.6,
            stock: 18,
          },
          {
            _id: "comp5",
            name: "Lenovo ThinkCentre",
            price: 749,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=400" }],
            description: "Business desktop with Intel Core i5, 16GB RAM, 512GB SSD",
            rating: 4.2,
            stock: 25,
          },
          {
            _id: "comp6",
            name: "ASUS ROG Gaming Desktop",
            price: 2199,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400" }],
            description: "Premium gaming PC with RTX 4080, AMD Ryzen 9, 64GB RAM",
            rating: 4.8,
            stock: 5,
          },
          {
            _id: "comp7",
            name: "Microsoft Surface Studio",
            price: 3499,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400" }],
            description: "All-in-one desktop with touchscreen display, Intel i7, 32GB RAM",
            rating: 4.5,
            stock: 3,
          },
          {
            _id: "comp8",
            name: "CyberPowerPC Gamer Supreme",
            price: 1599,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400" }],
            description: "Mid-range gaming PC with RTX 3070, AMD Ryzen 7, 16GB RAM",
            rating: 4.4,
            stock: 12,
          },
          {
            _id: "comp9",
            name: "Intel NUC Mini PC",
            price: 649,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?w=400" }],
            description: "Ultra-compact desktop for office and home use, Intel i5, 8GB RAM",
            rating: 4.1,
            stock: 20,
          },
          {
            _id: "comp10",
            name: "Alienware Aurora R15",
            price: 2499,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400" }],
            description: "High-end gaming desktop with liquid cooling, RTX 4090, 64GB RAM",
            rating: 4.9,
            stock: 2,
          },
          {
            _id: "comp11",
            name: "Apple iMac 24-inch",
            price: 1499,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400" }],
            description: "Sleek all-in-one desktop with M1 chip, 8GB RAM, 512GB SSD",
            rating: 4.7,
            stock: 9,
          },
          {
            _id: "comp12",
            name: "MSI Aegis RS Gaming Desktop",
            price: 1799,
            category: "Electronics",
            subcategory: "computers",
            images: [{ url: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400" }],
            description: "Gaming desktop with RGB lighting, RTX 3080, Intel i7, 32GB RAM",
            rating: 4.5,
            stock: 8,
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

  // Extract unique brands and types from products
  const brands = useMemo(() => {
    const brandSet = new Set();
    products.forEach((product) => {
      const brand = product.name.split(" ")[0]; // Extract first word as brand
      brandSet.add(brand);
    });
    return Array.from(brandSet);
  }, [products]);

  const types = useMemo(() => {
    return ["Desktop PC", "All-in-One", "Gaming PC", "Mini PC", "Workstation"];
  }, []);

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Handle brand selection
  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  // Handle type selection
  const handleTypeChange = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Handle sort change
  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search term filter
        const matchesSearch =
          searchTerm === "" ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase());

        // Price range filter
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

        // Brand filter
        const productBrand = product.name.split(" ")[0];
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(productBrand);

        // Type filter - check if product name or description contains any of the selected types
        const matchesType =
          selectedTypes.length === 0 ||
          selectedTypes.some((type) => {
            const typeWords = type.toLowerCase().split(" ");
            return typeWords.every(
              (word) =>
                product.name.toLowerCase().includes(word) ||
                product.description?.toLowerCase().includes(word),
            );
          });

        return matchesSearch && matchesPrice && matchesBrand && matchesType;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "newest":
            // Assuming newer products have higher IDs
            return b._id.localeCompare(a._id);
          default: // 'featured'
            return (b.rating || 0) - (a.rating || 0); // Default sort by rating
        }
      });
  }, [products, searchTerm, priceRange, selectedBrands, selectedTypes, sortBy]);

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
            <Typography color="text.primary">Computers</Typography>
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
                  <span style={{ fontSize: "3rem" }}>💻</span>
                  Computers
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                  Desktop computers, workstations, and PC components
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Featured Products Carousel */}
        {!loading && !error && featuredProducts.length > 0 && (
          <Container maxWidth="xl" sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Featured Computers
            </Typography>
            <Box sx={carouselStyles}>
              <Carousel {...carouselSettings}>
                {featuredProducts.map((product) => (
                  <Box
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: { xs: "200px", sm: "300px", md: "400px" },
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src={product.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                        alt={product.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                          p: 3,
                          color: "white",
                        }}
                      >
                        <Typography variant="h5" component="h3" fontWeight={600}>
                          {product.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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
                        <Chip
                          label="Featured Product"
                          size="small"
                          sx={{
                            backgroundColor: "primary.main",
                            color: "white",
                            mt: 1,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Carousel>
            </Box>
          </Container>
        )}

        {/* Search and Filter Section */}
        <Container maxWidth="xl" sx={{ mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <TextField
              placeholder="Search computers..."
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

          {/* Sort options */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3, flexWrap: "wrap", gap: 1 }}>
            {["featured", "price-low", "price-high", "rating", "newest"].map((option) => {
              const label = {
                featured: "Featured",
                "price-low": "Price: Low to High",
                "price-high": "Price: High to Low",
                rating: "Highest Rated",
                newest: "Newest Arrivals",
              }[option];

              return (
                <Chip
                  key={option}
                  label={label}
                  onClick={() => handleSortChange(option)}
                  color={sortBy === option ? "primary" : "default"}
                  variant={sortBy === option ? "filled" : "outlined"}
                  sx={{ m: 0.5 }}
                />
              );
            })}
          </Box>

          <Grid container spacing={3}>
            {/* Filters */}
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Price Range */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Price Range
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={4000}
                    step={100}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">${priceRange[0]}</Typography>
                    <Typography variant="body2">${priceRange[1]}</Typography>
                  </Box>
                </Box>

                {/* Brands */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Brands
                  </Typography>
                  <FormGroup>
                    {brands.map((brand) => (
                      <FormControlLabel
                        key={brand}
                        control={
                          <Checkbox
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                            size="small"
                          />
                        }
                        label={brand}
                      />
                    ))}
                  </FormGroup>
                </Box>

                {/* Types */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Computer Type
                  </Typography>
                  <FormGroup>
                    {types.map((type) => (
                      <FormControlLabel
                        key={type}
                        control={
                          <Checkbox
                            checked={selectedTypes.includes(type)}
                            onChange={() => handleTypeChange(type)}
                            size="small"
                          />
                        }
                        label={type}
                      />
                    ))}
                  </FormGroup>
                </Box>

                {/* Reset Filters */}
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setPriceRange([0, 4000]);
                    setSelectedBrands([]);
                    setSelectedTypes([]);
                    setSortBy("featured");
                  }}
                >
                  Reset Filters
                </Button>
              </Paper>
            </Grid>

            {/* Product Grid will be placed here */}
            <Grid item xs={12} md={9}>
              {/* Results count */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} found
                </Typography>
              </Box>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={product._id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                          alt={product.name}
                          sx={{ objectFit: "cover" }}
                          onClick={() => navigate(`/product/${product._id}`)}
                          style={{ cursor: "pointer" }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                          <Typography variant="h6" component="h3" gutterBottom>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {product.description}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Rating value={product.rating || 0} precision={0.1} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({product.rating || 0})
                            </Typography>
                          </Box>
                          <Box
                            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                          >
                            <Typography variant="h6" color="primary.main" fontWeight={600}>
                              {formatPrice(product.price)}
                            </Typography>
                            <Chip
                              label={
                                product.stock > 10
                                  ? "In Stock"
                                  : product.stock > 0
                                    ? `Only ${product.stock} left`
                                    : "Out of Stock"
                              }
                              size="small"
                              color={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"}
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                        <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={(e) => handleAddToWishlist(product._id, e)}
                            disabled={actionLoading[`wishlist-${product._id}`]}
                          >
                            {isInWishlist(product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          </IconButton>
                          <Button
                            size="small"
                            variant="contained"
                            endIcon={<ShoppingCartIcon />}
                            onClick={(e) => handleAddToCart(product._id, e)}
                            disabled={actionLoading[`cart-${product._id}`]}
                            sx={{ ml: "auto" }}
                          >
                            {actionLoading[`cart-${product._id}`] ? "Adding..." : "Add to Cart"}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No products found matching your criteria.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setSearchTerm("");
                      setPriceRange([0, 4000]);
                      setSelectedBrands([]);
                      setSelectedTypes([]);
                      setSortBy("featured");
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
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
                      onClick={() => navigate(`/product/${product._id || product.id}`)}
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
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Rating value={product.rating || 0} precision={0.1} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.rating || 0})
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="h6" color="primary.main" fontWeight={600}>
                            {formatPrice(product.price)}
                          </Typography>
                          <Chip
                            label={
                              product.stock > 10
                                ? "In Stock"
                                : product.stock > 0
                                  ? `Only ${product.stock} left`
                                  : "Out of Stock"
                            }
                            size="small"
                            color={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"}
                            variant="outlined"
                          />
                        </Box>
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
                  No computers found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {searchTerm ? `No computers match "${searchTerm}"` : "No computers available at the moment"}
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

      {/* Related Products Section */}
      {!loading && !error && products.length > 0 && (
        <Box sx={{ backgroundColor: "#f5f5f5", py: 6 }}>
          <Container maxWidth="xl">
            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
              You May Also Like
            </Typography>
            <Box sx={carouselStyles}>
              <Carousel
                dots={false}
                infinite={true}
                speed={500}
                slidesToShow={4}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={4000}
                arrows={false}
                responsive={[
                  {
                    breakpoint: 1200,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 1,
                    },
                  },
                  {
                    breakpoint: 900,
                    settings: {
                      slidesToShow: 2,
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
                ]}
              >
                {products
                  .sort(() => 0.5 - Math.random()) // Randomly shuffle products
                  .slice(0, 8) // Take first 8 after shuffling
                  .map((product) => (
                    <Box key={product._id} sx={{ px: 1 }}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                          },
                        }}
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <CardMedia
                          component="img"
                          image={product.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                          alt={product.name}
                          sx={{ height: 200, objectFit: "cover" }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Typography variant="h6" component="h3" noWrap>
                            {product.name}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Rating value={product.rating || 0} precision={0.1} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({product.rating || 0})
                            </Typography>
                          </Box>
                          <Typography variant="h6" color="primary.main" fontWeight={600}>
                            {formatPrice(product.price)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
              </Carousel>
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
};

export default ComputersPage;
