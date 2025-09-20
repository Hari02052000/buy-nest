import React, { useState,useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { alpha, styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Grid, Card, Chip, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { useFetchData } from "./hooks/useFetchData";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "400px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const navLinks = [
  { label: "Home", href: "/" },
  { label: "shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Categories data
let debounceTimer

const Header = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef(null);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { itemCount: cartItemCount } = useAppSelector((state) => state.cart);
  const { itemCount: wishlistItemCount } = useAppSelector((state) => state.wishlist);
   const[categoryData,loading,error] = useFetchData("/category")
   const categories = categoryData?.categories || []
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleCategoryClick = (id,children) => {
    navigate("/products",{
      state : {
        id,
        children
      }
    });
    setShowCategories(false);
  };

  const handleSearchChange = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(()=>{
     const query = inputRef.current.value.trim();
      navigate("/products",{
      state : {
        search : query
      }
    });
    },500)
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  return (
    <Box>
      <AppBar position="static" color="primary" enableColorOnDark elevation={0}>
        {/* Main Header */}
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          {/* Logo/Site Name */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{ fontWeight: 700, flex: { xs: 1, md: "none" }, color: "inherit", textDecoration: "none" }}
          >
            Buy Nest
          </Typography>

          {/* Centered Search Bar */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {/* Update the search section */}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase 
                placeholder="Search products..." 
                inputProps={{ 'aria-label': 'search' }}
                //value={searchQuery}
                inputRef={inputRef} 
                onChange={handleSearchChange}
               // onKeyPress={handleSearchKeyPress}
              />
            </Search>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, ml: 2 }}>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                color="inherit"
                component={Link}
                to={link.href}
                sx={{ fontWeight: 500 }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
            <IconButton color="inherit" component={Link} to="/wishlist" sx={{ position: "relative" }}>
              <FavoriteBorderIcon />
              {wishlistItemCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: "error.main",
                    color: "white",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  {wishlistItemCount}
                </Box>
              )}
            </IconButton>
            <IconButton color="inherit" component={Link} to="/cart" sx={{ position: "relative" }}>
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: "error.main",
                    color: "white",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  {cartItemCount}
                </Box>
              )}
            </IconButton>
            {isAuthenticated ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  Hi, {user?.userName || "User"}
                </Typography>
                <IconButton color="inherit" component={Link} to="/profile">
                  <AccountCircleIcon />
                </IconButton>
                <Button color="inherit" onClick={handleLogout} sx={{ fontWeight: 500 }}>
                  Logout
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: 500 }}>
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/signup" sx={{ fontWeight: 500 }}>
                  Signup
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>

        {/* Categories Bar - Integrated into Header */}
        { categories && categories.length > 0 &&
        <Box sx={{ backgroundColor: "primary.dark", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Container maxWidth="xl">
            <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
              {/* Categories Toggle Button */}
              <Button
                color="inherit"
                onClick={() => setShowCategories(!showCategories)}
                startIcon={showCategories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ mr: 2, fontWeight: 500 }}
              >
                All Categories
              </Button>

              {/* Quick Category Links */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, overflow: "hidden" }}>
                {categories.slice(0, 3).map((category) => (
                  <Chip
                    key={category.name}
                    label={category.name}
                    onClick={() => handleCategoryClick(category.id,category.children)}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                      cursor: "pointer",
                    }}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Container>
        </Box>
      }
      </AppBar>

      {/* Categories Dropdown */}
      <Collapse in={showCategories}>
        <Box sx={{ backgroundColor: "white", boxShadow: 2, borderBottom: "1px solid #e0e0e0" }}>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Shop by Category
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="flex-start">
              {categories.map((category) => (
                <Grid item xs={4} sm={3} md={2} lg={1.5} xl={1.33} key={category.name}>
                  <Card
                    onClick={() => handleCategoryClick(category.id,category.image.url)}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                      },
                      textAlign: "center",
                      p: { xs: 1, sm: 1.5 },
                      height: "100%",
                      minHeight: { xs: 80, sm: 100 },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 40, sm: 50 },
                        height: { xs: 40, sm: 50 },
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 8px",
                        backgroundImage: `url(${category.image.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                    >
                      {category.name}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Header;
