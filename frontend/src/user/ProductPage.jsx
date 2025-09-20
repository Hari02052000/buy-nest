import  { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  CircularProgress, 
  Alert, 
  Pagination,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ProductSearch from './components/ProductSearch';
import ProductCard from './components/ProductCard';
import { useLocation } from "react-router-dom";
import { getCategories,getProducts } from "../services/product.service"
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [wishlistItems, setWishlistItems] = useState([]); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const productsPerPage = 20;  
  const { user } = useAuth();
  const location = useLocation();
  const defaultCategory = location.state?.id;
  const search = location.state?.search
  console.log('search tearm  ',search);
   console.log('selected',selectedCategoryId);
   useEffect(()=>{
     const fetchCategory = async()=>{
      try {
      const response = await getCategories('/category')
      if(response.categories) setCategories(response.categories)
        setLoading(false)
      } catch (error) {
        setError(error.message || "category not get")
        setLoading(false)
      }
     }
     fetchCategory()
   },[])
   useEffect(()=>{
     const fetchProducts = async()=>{
      try {
        let url = '/product' 
        const params = new URLSearchParams();
        if(defaultCategory){
         params.set('category', defaultCategory);
        }
        if(search){
         params.set('search', search);
        }
        if(selectedCategoryId){
        params.set('category', selectedCategoryId);
        }
        const queryString = params.toString();
        const finalUrl = queryString ? `${url}?${queryString}` : url;
        setLoading(true)
      const response = await getProducts(finalUrl)
      console.log(response);
      if(response.products) setProducts(response.products)
        setLoading(false)
      } catch (error) {
        setError(error.message || "products not get")
        setLoading(false)
      }
     }
     fetchProducts()
   },[defaultCategory,search,selectedCategoryId])
   
  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.data?.map(item => item.productId) || []);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  return (
    <Box>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search Component */}
        <ProductSearch
          categories={categories}
          defaultCategory={defaultCategory}
          onCategoryChange={(id) => setSelectedCategoryId(id)}
        />

        {/* Results Summary */}
        {/* {searchResults && (
          <Box mb={3}>
            <Typography variant="h5" gutterBottom>
              {totalProducts} {totalProducts === 1 ? 'result' : 'results'} found
            </Typography>
            {getSearchSummary() && (
              <Typography variant="body1" color="text.secondary">
                Showing results for: {getSearchSummary()}
              </Typography>
            )}
          </Box>
        )} */}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard 
                  product={product} 
                   isInWishlist={wishlistItems.includes(product.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* No Results */}
        {!loading && !error && products.length === 0 && (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or browse our categories
            </Typography>
          </Paper>
        )}

        {/* Pagination */}
        {/* {totalProducts > productsPerPage && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(totalProducts / productsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )} */}
      </Container>
    </Box>
  );
};

export default ProductPage;