import { createSlice } from "@reduxjs/toolkit";
import { fetchBrands } from "../action/brand";
import { getValueLabel } from "~/utils/helper";

const brandSlice = createSlice({
    name: "brand",
    initialState:{
        isLoading: false,
        brands: [],
        isError: false,
    },
    extraReducers: (builder) =>{
        builder.addCase(fetchBrands.pending,(state) =>{
            state.isLoading = true
        })
        builder.addCase(fetchBrands.fulfilled,(state,action) =>{
            state.isLoading = false
            state.brands = getValueLabel(action.payload) 
        })
        builder.addCase(fetchBrands.rejected,(state) =>{
            state.isLoading = false
            state.isError = true
        })
    }
})
const brandReducer = brandSlice.reducer
const brandActions = brandSlice.actions
export {brandReducer,brandActions}