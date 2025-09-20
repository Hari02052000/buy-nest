import React, { useEffect } from "react";
import "./User.css";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { Routes, Route } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { checkAuthStatus } from "../store/slices/authSlice";
import { fetchCart } from "../store/slices/cartSlice";
import { fetchWishlist } from "../store/slices/wishlistSlice";
import Home from "./Home";
import Contact from "./Contact";
import About from "./About";
import Login from "./Login";
import Signup from "./Signup";
import ShopPage from "./ShopPage";
import ProductPage from "./ProductPage";
import ProductDetailPage from "./ProductDetailPage";
import CategoryPage from "./CategoryPage";
import CartPage from "./CartPage";
import WishlistPage from "./WishlistPage";
import ProfilePage from "./ProfilePage";
import CheckoutPage from "./CheckoutPage";
import Order from "./Order";
import { SnackbarProvider } from "../store/snackbar/SnackbarContext"
// Individual Category Pages
import ComputersPage from "./ComputersPage";
import LaptopsPage from "./LaptopsPage";
import SmartphonesPage from "./SmartphonesPage";
import HeadphonesPage from "./HeadphonesPage";
import ClothingPage from "./ClothingPage";
import ElectronicsPage from "./ElectronicsPage";
import HomeKitchenPage from "./HomeKitchenPage";
import SportsPage from "./SportsPage";
import BooksPage from "./BooksPage";
import FashionPage from "./FashionPage";
import OrderConfirmationPage from "./OrderConfirmationPage";
import Header from "./Header";
import Footer from "./Footer";

function UserApp() {
  const dispatch = useAppDispatch();
  const isLogedIn = false;

  useEffect(() => {
    // Initialize auth state on app load
    dispatch(checkAuthStatus()).then((result) => {
      if (result.type === "auth/checkAuthStatus/fulfilled") {
        dispatch(fetchCart());
        dispatch(fetchWishlist());
      }
    });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        {/* protected routes */}
        <Route path="/order" element={<Order />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
      </SnackbarProvider>
    </ThemeProvider>
  );

  // Remove this duplicate line:
  {
    /* <Route path="/products/:id" element={<ProductDetailPage />} /> */
  }
  // Keep only:
  {
    /* <Route path="/product/:id" element={<ProductDetailPage />} /> */
  }
  {
    /* <Route path="/checkout" element={<CheckoutPage />} /> */
  }
  {
    /* <Route path="/order-conform" element={<OrderConfirmationPage />} /> */
  }
  {
    /* Individual Category Pages - Electronics & Technology */
  }
  {
    /* <Route path="/electronics" element={<ElectronicsPage />} /> */
  }
  {
    /* <Route path="/computers" element={<ComputersPage />} /> */
  }
  {
    /* <Route path="/laptops" element={<LaptopsPage />} /> */
  }
  {
    /* <Route path="/smartphones" element={<SmartphonesPage />} /> */
  }
  {
    /* <Route path="/headphones" element={<HeadphonesPage />} /> */
  }
  {
    /* <Route path="/gaming" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/cameras" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/tv-audio" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/smart-home" element={<CategoryPage />} /> */
  }
  {
    /* Individual Category Pages - Home & Garden */
  }
  {
    /* <Route path="/home-kitchen" element={<HomeKitchenPage />} /> */
  }
  {
    /* <Route path="/furniture" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/home-decor" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/kitchen" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/bedding" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/garden" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/tools" element={<CategoryPage />} /> */
  }
  {
    /* Individual Category Pages - Fashion & Beauty */
  }
  {
    /* <Route path="/fashion" element={<FashionPage />} /> */
  }
  {
    /* <Route path="/clothing" element={<ClothingPage />} /> */
  }
  {
    /* <Route path="/shoes" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/jewelry" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/watches" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/beauty" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/bags" element={<CategoryPage />} /> */
  }
  {
    /* Category Routes - Sports & Outdoors */
  }
  {
    /* <Route path="/sports" element={<SportsPage />} /> */
  }
  {
    /* <Route path="/fitness" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/outdoor" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/cycling" element={<CategoryPage />} /> */
  }
  {
    /* Category Routes - Health & Personal Care */
  }
  {
    /* <Route path="/health" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/personal-care" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/vitamins" element={<CategoryPage />} /> */
  }
  {
    /* Category Routes - Books & Media */
  }
  {
    /* <Route path="/books" element={<BooksPage />} /> */
  }
  {
    /* <Route path="/music" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/movies" element={<CategoryPage />} /> */
  }
  {
    /* Category Routes - Automotive & Industrial */
  }
  {
    /* <Route path="/automotive" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/industrial" element={<CategoryPage />} /> */
  }
  {
    /* Category Routes - Baby & Kids */
  }
  {
    /* <Route path="/baby" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/toys" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/kids-fashion" element={<CategoryPage />} /> */
  }
  {
    /* Category Routes - Pet Supplies */
  }
  {
    /* <Route path="/pet-supplies" element={<CategoryPage />} /> */
  }
  {
    /* Category Routes - Office & School */
  }
  {
    /* <Route path="/office" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/stationery" element={<CategoryPage />} /> */
  }
  {
    /* <Route path="/cart" element={<CartPage />} /> */
  }
  {
    /* <Route path="/wishlist" element={<WishlistPage />} /> */
  }
  {
    /* <Route path="/profile" element={<ProfilePage />} /> */
  }
}

export default UserApp;
