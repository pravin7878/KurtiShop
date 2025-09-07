// src/app/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Update existing item
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + item.qty } : x
        );
        toast.success("Product quantity updated in cart!");
      } else {
        // Add new item
        state.cartItems.push(item);
        toast.success("Product added to cart successfully!");
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      toast.success("Product removed from cart!");
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      toast.success("Cart cleared!");
    },

    updateQty: (state, action) => {
      const { _id, qty } = action.payload;
      const item = state.cartItems.find((x) => x._id === _id);
      if (item) {
        item.qty = qty;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
        toast.success("Quantity updated!");
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQty } =
  cartSlice.actions;
export default cartSlice.reducer;
