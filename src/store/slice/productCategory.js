import { createSlice } from "@reduxjs/toolkit";
import { fetchProductCategory } from "../action/productCategory";



const productCategorySlice = createSlice({
    name: "productCategory",
    initialState:{
        isLoading: false,
        categories: [],
        isError: false,
    },
    extraReducers: (builder) =>{
        builder.addCase(fetchProductCategory.pending,(state) =>{
            state.isLoading = true
        })
        builder.addCase(fetchProductCategory.fulfilled,(state,action) =>{
            state.isLoading = false
            state.categories = action.payload
        })
        builder.addCase(fetchProductCategory.rejected,(state) =>{
            state.isLoading = false
            state.isError = true
        })
    }
})
const productCategoryReducer = productCategorySlice.reducer
const productCategoryActions = productCategorySlice.actions
export {productCategoryReducer,productCategoryActions}