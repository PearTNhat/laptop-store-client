import { createSlice } from "@reduxjs/toolkit";



const userSlice = createSlice({
    name: "user",
    initialState: {
        accessToken: null,
        isLogin: false,
    },
    reducers: {
        login: (state, action) => {
            state.accessToken = action.payload;
            state.isLogin = true;
        },
        resgister: (state, action) => {
            state.accessToken = action.payload;
            state.isLogin = true;
        },
        logout: (state) => {
            state.accessToken = null;
            state.isLogin = false;
        }
    }
})
const userActions = userSlice.actions;
const userReducer = userSlice.reducer;
export { userReducer,userActions }