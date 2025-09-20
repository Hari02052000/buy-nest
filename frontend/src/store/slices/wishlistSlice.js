import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addToWishlistService,clearWishlistService,getWishlistService,removeFromWishlistService  } from "../../services/product.service"

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  try {
    const response = await getWishlistService();
    if (response.success) {
      return response.data;
    }
    return rejectWithValue(response.message);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await addToWishlistService(productId);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await removeFromWishlistService(productId);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const clearWishlistAsync = createAsyncThunk(
  "wishlist/clearWishlistAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearWishlistService();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  items: [],
  itemCount: 0,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.itemCount = 0;
    },
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.itemCount = action.payload.itemCount || 0;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.itemCount = action.payload.itemCount || 0;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.itemCount = action.payload.itemCount || 0;
      })
      .addCase(clearWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.itemCount = action.payload.itemCount || 0;
      });
  },
});

export const { clearWishlist, clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
