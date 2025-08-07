import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  productIds: number[];
}

const initialState: WishlistState = {
  productIds: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<number>) {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.productIds = state.productIds.filter(id => id !== action.payload);
    },
    clearWishlist(state) {
      state.productIds = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;