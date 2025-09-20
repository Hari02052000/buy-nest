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
  Divider,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { useFetchData } from "./hooks/useFetchData";
import Header from "./Header";
import Footer from "./Footer";
import CategoryCard from "./components/CategoryCard";

// Comprehensive categories similar to Amazon

const ShopPage = () => {
    const[categoryData,loading,error] = useFetchData("/category")
    const categories = categoryData?.categories || []
   console.log(categories);
  return (
    <>
      <Box sx={{ background: "#fafbfc", minHeight: "100vh" }}>
        {/* Hero Banner */}
        <Box sx={{ backgroundColor: "primary.main", py: 6, mb: 4, color: "primary.contrastText" }}>
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" fontWeight={700} gutterBottom>
                  Everything You Need
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                  From electronics to home essentials, discover millions of products with unbeatable prices
                  and fast delivery.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

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

        {!loading && !error && categories.length > 0 && (
          <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ mb: 6 }}>      
            {
              categories.map((category)=><CategoryCard key={category.id} category={category}/>)
            }
            </Box>
          </Container>
        )}
      </Box>
    </>
  );
};

export default ShopPage;
