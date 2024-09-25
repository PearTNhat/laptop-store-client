import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "../action/user";



const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: {},
        accessToken: null,
        isLoggedIn: false,
        isLoading: false,
        isError: false
    },
    reducers: {
        //  vì login giống resgister nên ta có thể sử dụng chung 1 hàm
        login: (state, action) => {
            console.log('action.payload', action.payload);
            state.accessToken = action.payload.accessToken;
            state.isLoggedIn = true;
            state.userData=action.payload.userData
        },
        logout: (state) => {
            state.accessToken = null;
            state.isLoggedIn = false;
            state.userData = {}
        },
        extraReducers: (builder) =>{
            builder.addCase(fetchCurrentUser.pending,(state) =>{
                state.isLoading = true
            })
            builder.addCase(fetchCurrentUser.fulfilled,(state,action) =>{
                state.isLoading = false
                state.userData=action.payload.userData
            })
            builder.addCase(fetchCurrentUser.rejected,(state) =>{
                state.isLoading = false
                state.isError = true
            })
        }
    }
})
const userActions = userSlice.actions;
const userReducer = userSlice.reducer;
export { userReducer,userActions }