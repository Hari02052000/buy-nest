const API_BASE_URL = "http://localhost:5000/api/v1";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Process failed requests queue
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // Enhanced response handler with automatic token refresh
  async handleResponse(response, originalRequest = null) {
    if (response.status === 401 && originalRequest) {
      if (this.isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry original request with new token
          return fetch(originalRequest.url, {
            ...originalRequest,
            headers: this.getAuthHeaders(),
          }).then(this.handleResponse.bind(this));
        });
      }

      this.isRefreshing = true;

      try {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          this.processQueue(null, refreshResult.data.accessToken);

          // Retry original request with new token
          const retryResponse = await fetch(originalRequest.url, {
            ...originalRequest,
            headers: this.getAuthHeaders(),
          });

          return this.handleResponse(retryResponse);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (error) {
        this.processQueue(error, null);
        // Redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Enhanced fetch method with retry capability
  // Enhanced fetch method with credentials
  async fetchWithAuth(url, options = {}) {
    const requestOptions = {
      ...options,
      credentials: "include", // Include cookies
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, requestOptions);
    return this.handleResponse(response, { url, ...requestOptions });
  }

  // Fix login method
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: "POST",
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await this.handleResponse(response);
    if (data.success && data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }
    return data;
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await this.handleResponse(response);
    if (data.success && data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }
    return data;
  }

  async logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  // Updated refresh token method
  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include", // Send cookies instead of body
      headers: {
        "Content-Type": "application/json",
      },
      // Remove body since backend expects cookies
    });

    const data = await this.handleResponse(response);
    if (data.success && data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    }
    return data;
  }

  // Cart APIs - Updated to use fetchWithAuth
  async getCart() {
    return this.fetchWithAuth(`${this.baseURL}/cart`);
  }

  async addToCart(productId, quantity = 1) {
    return this.fetchWithAuth(`${this.baseURL}/cart/add`, {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId, quantity) {
    return this.fetchWithAuth(`${this.baseURL}/cart/update`, {
      method: "PUT",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.fetchWithAuth(`${this.baseURL}/cart/remove/${productId}`, {
      method: "DELETE",
    });
  }

  async clearCart() {
    return this.fetchWithAuth(`${this.baseURL}/cart/clear`, {
      method: "DELETE",
    });
  }

  // Wishlist APIs - Updated to use fetchWithAuth
  async getWishlist() {
    return this.fetchWithAuth(`${this.baseURL}/wishlist`);
  }

  async addToWishlist(productId) {
    return this.fetchWithAuth(`${this.baseURL}/wishlist/add`, {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId) {
    return this.fetchWithAuth(`${this.baseURL}/wishlist/remove/${productId}`, {
      method: "DELETE",
    });
  }

  async clearWishlist() {
    return this.fetchWithAuth(`${this.baseURL}/wishlist/clear`, {
      method: "DELETE",
    });
  }

  // Product APIs - Updated to use fetchWithAuth
  async getProducts(limit = 20, skip = 0) {
    return this.fetchWithAuth(`${this.baseURL}/product?limit=${limit}&skip=${skip}`);
  }

  async getProductById(productId) {
    try {
      return await this.fetchWithAuth(`${this.baseURL}/product/${productId}`);
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      // Return a more specific error for debugging
      throw new Error(`Failed to fetch product ${productId}: ${error.message}`);
    }
  }

  // Category APIs - Updated to use fetchWithAuth
  async getCategories(limit = 20, page = 1) {
    return this.fetchWithAuth(`${this.baseURL}/category?limit=${limit}&page=${page}`);
  }

  async getProductsByCategory(categoryId, limit = 20) {
    return this.fetchWithAuth(`${this.baseURL}/product?category=${categoryId}&limit=${limit}`);
  }

  // Utility methods
  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // User Profile APIs
  async updateUserProfile(profileData) {
    return this.fetchWithAuth(`${this.baseURL}/user/profile`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async getUserProfile() {
    return this.fetchWithAuth(`${this.baseURL}/user/profile`);
  }

  // Profile Image APIs
  async uploadProfileImage(formData) {
    return this.fetchWithAuth(`${this.baseURL}/user/profile/image`, {
      method: "POST",
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...this.getAuthHeaders(),
        "Content-Type": undefined,
      },
      body: formData,
    });
  }

  async removeProfileImage() {
    return this.fetchWithAuth(`${this.baseURL}/user/profile/image`, {
      method: "DELETE",
    });
  }
}

export default new ApiService();
