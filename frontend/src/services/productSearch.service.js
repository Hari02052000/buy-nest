import apiService from './api';

class ProductSearchService {
  async searchProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await apiService.get(`/products/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  async getProducts(limit = 20, skip = 0, category = '') {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit.toString());
      queryParams.append('skip', skip.toString());
      if (category) queryParams.append('category', category);

      const response = await apiService.get(`/products?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const response = await apiService.get('/categories');
      return response;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }
}

export default new ProductSearchService();