import { createSlice } from "@reduxjs/toolkit";
import { fetchNewProduct } from "../action/product";

const productSlice = createSlice({
    name: "products",
    initialState:{
        isLoading: false,
        newProducts: [],
        isError: false,
    },
    extraReducers: (builder) =>{
        builder.addCase(fetchNewProduct.pending,(state) =>{
            state.isLoading = true
        })
        builder.addCase(fetchNewProduct.fulfilled,(state,action) =>{
            state.isLoading = false
            state.newProducts = action.payload
        })
        builder.addCase(fetchNewProduct.rejected,(state) =>{
            state.isLoading = false
            state.isError = true
        })
    }
});
const productReducer = productSlice.reducer
const productActions = productSlice.actions
export {productReducer,productActions}