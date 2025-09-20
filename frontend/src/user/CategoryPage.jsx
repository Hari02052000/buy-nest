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
  Chip,
  Stack,
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
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

// Category configurations with metadata
const categoryConfigs = {
  // Electronics & Technology
  computers: {
    name: "Computers",
    description: "Desktop computers, workstations, and PC components",
    icon: "💻",
    parentCategory: "electronics",
    keywords: ["computer", "desktop", "pc", "workstation"],
  },
  laptops: {
    name: "Laptops",
    description: "Portable computers, notebooks, and ultrabooks",
    icon: "💻",
    parentCategory: "electronics",
    keywords: ["laptop", "notebook", "ultrabook", "macbook"],
  },
  smartphones: {
    name: "Smartphones",
    description: "Mobile phones, accessories, and cases",
    icon: "📱",
    parentCategory: "electronics",
    keywords: ["phone", "smartphone", "mobile", "iphone", "android"],
  },
  headphones: {
    name: "Headphones",
    description: "Headphones, earbuds, and audio accessories",
    icon: "🎧",
    parentCategory: "electronics",
    keywords: ["headphones", "earbuds", "headset", "audio"],
  },
  gaming: {
    name: "Gaming",
    description: "Gaming consoles, accessories, and games",
    icon: "🎮",
    parentCategory: "electronics",
    keywords: ["gaming", "console", "playstation", "xbox", "nintendo"],
  },
  cameras: {
    name: "Cameras",
    description: "Digital cameras, lenses, and photography equipment",
    icon: "📷",
    parentCategory: "electronics",
    keywords: ["camera", "photography", "lens", "dslr"],
  },
  "tv-audio": {
    name: "TV & Audio",
    description: "Televisions, speakers, and home audio systems",
    icon: "📺",
    parentCategory: "electronics",
    keywords: ["tv", "television", "speaker", "audio", "sound"],
  },
  "smart-home": {
    name: "Smart Home",
    description: "Smart devices, home automation, and IoT products",
    icon: "🏠",
    parentCategory: "electronics",
    keywords: ["smart", "home", "automation", "iot", "alexa"],
  },

  // Home & Garden
  furniture: {
    name: "Furniture",
    description: "Home and office furniture for every room",
    icon: "🪑",
    parentCategory: "home",
    keywords: ["furniture", "chair", "table", "sofa", "bed"],
  },
  "home-decor": {
    name: "Home Decor",
    description: "Decorative items, artwork, and home accessories",
    icon: "🏡",
    parentCategory: "home",
    keywords: ["decor", "decoration", "art", "vase", "candle"],
  },
  kitchen: {
    name: "Kitchen",
    description: "Kitchen appliances, cookware, and dining essentials",
    icon: "🍳",
    parentCategory: "home",
    keywords: ["kitchen", "cooking", "appliance", "cookware"],
  },
  bedding: {
    name: "Bedding",
    description: "Bed sheets, pillows, comforters, and bedroom textiles",
    icon: "🛏️",
    parentCategory: "home",
    keywords: ["bedding", "sheets", "pillow", "comforter", "blanket"],
  },
  garden: {
    name: "Garden",
    description: "Gardening tools, plants, and outdoor equipment",
    icon: "🌱",
    parentCategory: "home",
    keywords: ["garden", "plant", "outdoor", "lawn", "flower"],
  },
  tools: {
    name: "Tools",
    description: "Hand tools, power tools, and hardware",
    icon: "🔧",
    parentCategory: "home",
    keywords: ["tools", "hardware", "drill", "hammer", "wrench"],
  },

  // Fashion & Beauty
  clothing: {
    name: "Clothing",
    description: "Fashion apparel for men, women, and children",
    icon: "👕",
    parentCategory: "fashion",
    keywords: ["clothing", "shirt", "dress", "pants", "jacket"],
  },
  shoes: {
    name: "Shoes",
    description: "Footwear for all occasions and activities",
    icon: "👟",
    parentCategory: "fashion",
    keywords: ["shoes", "sneakers", "boots", "sandals", "heels"],
  },
  jewelry: {
    name: "Jewelry",
    description: "Fine jewelry, accessories, and precious metals",
    icon: "💍",
    parentCategory: "fashion",
    keywords: ["jewelry", "ring", "necklace", "earrings", "bracelet"],
  },
  watches: {
    name: "Watches",
    description: "Timepieces, smartwatches, and watch accessories",
    icon: "⌚",
    parentCategory: "fashion",
    keywords: ["watch", "timepiece", "smartwatch", "rolex", "apple"],
  },
  beauty: {
    name: "Beauty",
    description: "Cosmetics, skincare, and beauty products",
    icon: "💄",
    parentCategory: "fashion",
    keywords: ["beauty", "makeup", "cosmetics", "skincare", "lipstick"],
  },
  bags: {
    name: "Bags",
    description: "Handbags, backpacks, and travel accessories",
    icon: "👜",
    parentCategory: "fashion",
    keywords: ["bag", "handbag", "backpack", "purse", "luggage"],
  },

  // Sports & Outdoors
  sports: {
    name: "Sports",
    description: "Sports equipment and athletic gear",
    icon: "⚽",
    parentCategory: "sports",
    keywords: ["sports", "athletic", "ball", "equipment", "gear"],
  },
  fitness: {
    name: "Fitness",
    description: "Exercise equipment and fitness accessories",
    icon: "💪",
    parentCategory: "sports",
    keywords: ["fitness", "exercise", "gym", "workout", "training"],
  },
  outdoor: {
    name: "Outdoor",
    description: "Outdoor recreation and adventure gear",
    icon: "🏕️",
    parentCategory: "sports",
    keywords: ["outdoor", "camping", "hiking", "adventure", "nature"],
  },
  cycling: {
    name: "Cycling",
    description: "Bicycles, cycling gear, and accessories",
    icon: "🚴",
    parentCategory: "sports",
    keywords: ["cycling", "bike", "bicycle", "helmet", "gear"],
  },

  // Health & Personal Care
  health: {
    name: "Health",
    description: "Health products, medical supplies, and wellness items",
    icon: "🏥",
    parentCategory: "health",
    keywords: ["health", "medical", "wellness", "care", "medicine"],
  },
  "personal-care": {
    name: "Personal Care",
    description: "Personal hygiene and grooming products",
    icon: "🧴",
    parentCategory: "health",
    keywords: ["personal", "care", "hygiene", "grooming", "soap"],
  },
  vitamins: {
    name: "Vitamins",
    description: "Vitamins, supplements, and nutritional products",
    icon: "💊",
    parentCategory: "health",
    keywords: ["vitamins", "supplements", "nutrition", "health", "pills"],
  },

  // Books & Media
  books: {
    name: "Books",
    description: "Books, e-books, and reading materials",
    icon: "📚",
    parentCategory: "media",
    keywords: ["books", "reading", "novel", "textbook", "literature"],
  },
  music: {
    name: "Music",
    description: "Music albums, instruments, and audio equipment",
    icon: "🎵",
    parentCategory: "media",
    keywords: ["music", "album", "instrument", "cd", "vinyl"],
  },
  movies: {
    name: "Movies",
    description: "Movies, TV shows, and entertainment media",
    icon: "🎬",
    parentCategory: "media",
    keywords: ["movies", "film", "dvd", "bluray", "entertainment"],
  },

  // Automotive & Industrial
  automotive: {
    name: "Automotive",
    description: "Car parts, accessories, and automotive supplies",
    icon: "🚗",
    parentCategory: "automotive",
    keywords: ["automotive", "car", "parts", "accessories", "vehicle"],
  },
  industrial: {
    name: "Industrial",
    description: "Industrial equipment and commercial supplies",
    icon: "🏭",
    parentCategory: "automotive",
    keywords: ["industrial", "commercial", "equipment", "machinery", "supplies"],
  },

  // Baby & Kids
  baby: {
    name: "Baby",
    description: "Baby products, care items, and nursery essentials",
    icon: "👶",
    parentCategory: "kids",
    keywords: ["baby", "infant", "nursery", "care", "feeding"],
  },
  toys: {
    name: "Toys",
    description: "Toys, games, and educational products for children",
    icon: "🧸",
    parentCategory: "kids",
    keywords: ["toys", "games", "children", "play", "educational"],
  },
  "kids-fashion": {
    name: "Kids Fashion",
    description: "Clothing and accessories for children",
    icon: "👶",
    parentCategory: "kids",
    keywords: ["kids", "children", "clothing", "fashion", "apparel"],
  },

  // Pet Supplies
  "pet-supplies": {
    name: "Pet Supplies",
    description: "Pet food, toys, and care products",
    icon: "🐕",
    parentCategory: "pets",
    keywords: ["pet", "dog", "cat", "animal", "supplies"],
  },

  // Office & School
  office: {
    name: "Office",
    description: "Office supplies, furniture, and business equipment",
    icon: "🏢",
    parentCategory: "office",
    keywords: ["office", "business", "supplies", "furniture", "equipment"],
  },
  stationery: {
    name: "Stationery",
    description: "Pens, paper, and school/office supplies",
    icon: "✏️",
    parentCategory: "office",
    keywords: ["stationery", "pen", "paper", "supplies", "school"],
  },
};

// Mock product data - you can expand this or fetch from API
const mockProducts = [
  // Electronics
  {
    _id: "elec1",
    name: "iPhone 15 Pro Max",
    price: 1199,
    category: "Electronics",
    subcategory: "smartphones",
    images: [{ url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400" }],
    description: "Latest iPhone with advanced camera system",
  },
  {
    _id: "elec2",
    name: 'MacBook Pro 16"',
    price: 2499,
    category: "Electronics",
    subcategory: "laptops",
    images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" }],
    description: "Powerful laptop for professionals",
  },
  {
    _id: "elec3",
    name: "Dell XPS 13",
    price: 1299,
    category: "Electronics",
    subcategory: "computers",
    images: [{ url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400" }],
    description: "High-performance desktop computer",
  },
  {
    _id: "elec4",
    name: "Sony WH-1000XM5",
    price: 399,
    category: "Electronics",
    subcategory: "headphones",
    images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" }],
    description: "Noise-canceling wireless headphones",
  },
  {
    _id: "elec5",
    name: "PlayStation 5",
    price: 499,
    category: "Electronics",
    subcategory: "gaming",
    images: [{ url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400" }],
    description: "Next-gen gaming console",
  },
  {
    _id: "elec6",
    name: "Canon EOS R5",
    price: 3899,
    category: "Electronics",
    subcategory: "cameras",
    images: [{ url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400" }],
    description: "Professional mirrorless camera",
  },

  // Fashion
  {
    _id: "fashion1",
    name: "Nike Air Jordan 1",
    price: 170,
    category: "Fashion",
    subcategory: "shoes",
    images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" }],
    description: "Classic basketball sneakers",
  },
  {
    _id: "fashion2",
    name: "Levi's 501 Jeans",
    price: 89,
    category: "Fashion",
    subcategory: "clothing",
    images: [{ url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" }],
    description: "Classic straight-leg jeans",
  },
  {
    _id: "fashion3",
    name: "Rolex Submariner",
    price: 8100,
    category: "Fashion",
    subcategory: "watches",
    images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" }],
    description: "Luxury diving watch",
  },
  {
    _id: "fashion4",
    name: "Coach Handbag",
    price: 350,
    category: "Fashion",
    subcategory: "bags",
    images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" }],
    description: "Luxury leather handbag",
  },

  // Home
  {
    _id: "home1",
    name: "IKEA MALM Bed",
    price: 179,
    category: "Home",
    subcategory: "furniture",
    images: [{ url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400" }],
    description: "Modern bed frame",
  },
  {
    _id: "home2",
    name: "KitchenAid Mixer",
    price: 379,
    category: "Home",
    subcategory: "kitchen",
    images: [{ url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" }],
    description: "Professional stand mixer",
  },

  // Sports
  {
    _id: "sports1",
    name: "Peloton Bike",
    price: 1445,
    category: "Sports",
    subcategory: "fitness",
    images: [{ url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400" }],
    description: "Interactive fitness bike",
  },
  {
    _id: "sports2",
    name: "Trek Mountain Bike",
    price: 1299,
    category: "Sports",
    subcategory: "cycling",
    images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" }],
    description: "All-terrain mountain bike",
  },
];

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  const navigate = useNavigate();

  const categoryConfig = categoryConfigs[category];

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === "string") {
      return price.startsWith("$") ? price : `$${price}`;
    }
    return `$${price?.toFixed(2) || "0.00"}`;
  };

  // Use mock products for this category
  useEffect(() => {
    const loadCategoryProducts = () => {
      if (!categoryConfig) {
        setError("Category not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use mock data directly instead of API call
        const filteredMockProducts = mockProducts.filter((product) => {
          const matchesSubcategory = product.subcategory?.toLowerCase() === category.toLowerCase();
          const matchesKeywords = categoryConfig.keywords.some(
            (keyword) =>
              product.name?.toLowerCase().includes(keyword.toLowerCase()) ||
              product.description?.toLowerCase().includes(keyword.toLowerCase()),
          );
          return matchesSubcategory || matchesKeywords;
        });

        setProducts(filteredMockProducts);
        console.log("Using mock products data for category:", category);
      } catch (err) {
        console.error("Error loading mock products for category:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();
  }, [category, categoryConfig]);

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

  if (!categoryConfig) {
    return (
      <>
        <Header />
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Alert severity="error">Category not found</Alert>
        </Container>
        <Footer />
      </>
    );
  }

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
            <Typography color="text.primary">{categoryConfig.name}</Typography>
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
                  <span style={{ fontSize: "3rem" }}>{categoryConfig.icon}</span>
                  {categoryConfig.name}
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                  {categoryConfig.description}
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Search Section */}
        <Container maxWidth="xl" sx={{ mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <TextField
              placeholder={`Search ${categoryConfig.name.toLowerCase()}...`}
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
                  No products found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {searchTerm
                    ? `No products match "${searchTerm}" in ${categoryConfig.name}`
                    : `No products available in ${categoryConfig.name} category`}
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

export default CategoryPage;
