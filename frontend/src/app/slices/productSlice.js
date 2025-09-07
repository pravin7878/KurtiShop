import {createSlice} from "@reduxjs/toolkit"
import { fetchProducts } from "../actions/product"


const initialState = {
    isLoading : false,
    products : [],
    error : {isErr : false,message:""}
}


const productSlice = createSlice({
    name : "products",
    initialState,
    extraReducers : (builder)=>{
        builder
        .addCase(fetchProducts.pending , (state)=>{
            state.isLoading = true,
            state.error = {isErr : false,message:""}
        })
        .addCase(fetchProducts.fulfilled, (state,{payload})=>{
            state.isLoading = false
            state.error = {isErr : false,message:""}
            state.products = payload || []
        })
         .addCase(fetchProducts.rejected, (state,{payload})=>{
            state.isLoading = false
            state.error = {isErr : true,message:payload}
            state.products = []
        })
    }
})

export default productSlice.reducer