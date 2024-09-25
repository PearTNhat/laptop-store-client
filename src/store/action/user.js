import { createAsyncThunk } from "@reduxjs/toolkit"
import { getCurrentUser } from "~/apis/user"

export const fetchCurrentUser =createAsyncThunk( 'user/getUser',async (d,{rejectWithValue}) => {
    const accessToken = localStorage.getItem('accessToken')
    const response = await getCurrentUser({token: accessToken})
    if(!response?.success === 0) return rejectWithValue(response)
    return response.data
}
)