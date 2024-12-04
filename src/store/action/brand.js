
import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiGetAllBrands } from "~/apis/brand"


// The first argument is a string 'fetchBrands', which represents the name of the thunk action. This name will be used to generate action types for the pending, fulfilled, and rejected states of the asynchronous operation. 
//The second argument is an asynchronous function that will be executed when the thunk action is dispatched.
export const fetchBrands =createAsyncThunk( 'brand/getAll',async (d,{rejectWithValue}) => {
    const {data,success } = await apiGetAllBrands()
    if(!success) return rejectWithValue(data)
    return data
})