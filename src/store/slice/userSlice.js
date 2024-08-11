import { createSlice } from "@reduxjs/toolkit";



const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        accessToken: null,
        isLoggedIn: false,
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
        }
    }
})
const userActions = userSlice.actions;
const userReducer = userSlice.reducer;
export { userReducer,userActions }