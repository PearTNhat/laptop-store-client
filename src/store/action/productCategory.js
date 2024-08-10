
import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiGetAllCategories } from "~/apis/productCategory"

// The first argument is a string 'fetchProductCategory', which represents the name of the thunk action. This name will be used to generate action types for the pending, fulfilled, and rejected states of the asynchronous operation. 
//The second argument is an asynchronous function that will be executed when the thunk action is dispatched.
export const fetchProductCategory =createAsyncThunk( 'categories/getAll',async (d,{rejectWithValue}) => {
    const {data } = await apiGetAllCategories()
    if(!data?.lenght === 0) return rejectWithValue(data)
    return data
})