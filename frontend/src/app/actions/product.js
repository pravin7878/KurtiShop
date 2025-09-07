import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit"

const backendUri = import.meta.env.VITE_BACKEND_URI;


export const fetchProducts = createAsyncThunk("FETCH/PRODUCT",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${backendUri}/api/products`);
            return res.data
        } catch (err) {
            rejectWithValue(err.response?.data?.message || "Failed to fetch products");
        }
    }
) 