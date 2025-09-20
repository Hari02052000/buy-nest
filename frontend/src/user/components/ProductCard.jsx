import React, { useState,useEffect } from "react";

import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist } from "../../store/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../store/snackbar/SnackbarContext"

function ProductCard({ product }) {
    const { showSnackbar } = useSnackbar();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const [actionLoading, setActionLoading] = useState({});

  const handleAddToCart = async (productId, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      showSnackbar("Please login to add items to cart","warning")
      return;
    }
    setActionLoading((prev) => ({ ...prev, [`cart-${productId}`]: true }));
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      showSnackbar("Added to cart successfully!","success");
    } catch (error) {
      showSnackbar("Failed to add to cart","error")
    } finally {
      setActionLoading((prev) => ({ ...prev, [`cart-${productId}`]: false }));
    }
  };

  const handleAddToWishlist = async (productId, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      showSnackbar("Please login to add items to wishlist","warning")
      return;
    }
    setActionLoading((prev) => ({ ...prev, [`wishlist-${productId}`]: true }));
    try {
      await dispatch(addToWishlist(productId)).unwrap();
      showSnackbar("Added to wishlist successfully!","success");
    } catch (error) {
      showSnackbar("Failed to add to wishlist","error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [`wishlist-${productId}`]: false }));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  return (
  
    <Box sx={{ px: 2 }}>
      <Card
        sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: 2 }}
        onClick={() => navigate(`/product/${product._id || product.id}`)}
      >
        <CardMedia
          component="img"
          height="180"
          image={product.images?.[0]?.url}
          alt={product.name}
        />
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${product.price}
          </Typography>
        </CardContent>
        <CardActions sx={{ mt: "auto" }}>
          <Button
            size="small"
            variant="contained"
            endIcon={<ShoppingCartIcon />}
            onClick={(e) => handleAddToCart(product._id || product.id, e)}
            disabled={actionLoading[`cart-${product._id || product.id}`]}
          >
            {actionLoading[`cart-${product._id || product.id}`] ? "Adding..." : "Add to Cart"}
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
    </Box>
  );
}

export default ProductCard;
