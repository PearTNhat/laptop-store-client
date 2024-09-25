import { createAsyncThunk } from "@reduxjs/toolkit"
import { getAllProducts } from "~/apis/product"

export const fetchNewProduct =createAsyncThunk( 'product/getNew',async (d,{rejectWithValue}) => {
    const {data } = await getAllProducts({params: {sort: '-createdAt'}})
    if(!data?.length === 0) return rejectWithValue(data)
    return data
}
)