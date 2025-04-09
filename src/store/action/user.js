import { createAsyncThunk } from "@reduxjs/toolkit"
import { getCurrentUser } from "~/apis/user"

export const fetchCurrentUser = createAsyncThunk('current-user/getUser', async ({ token }, { rejectWithValue }) => {
    const response = await getCurrentUser({ token })
    if (!response?.success) return rejectWithValue(response)
    return response.data

}
)