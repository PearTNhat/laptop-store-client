import { configureStore} from "@reduxjs/toolkit";
import { productCategoryReducer } from "./slice/productCategory";
import { productReducer } from "./slice/product";
import storage from "redux-persist/lib/storage";
import { userReducer } from "./slice/userSlice";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig ={
    key:'shop/user',
    storage,
    whitelist:['accessToken','isLoggedIn','userData'] // only token will be persisted, other will be cleared after
}
const persistedReducer = persistReducer(persistConfig, userReducer)
const store = configureStore({
    reducer:{
        productCategory:productCategoryReducer,
        products: productReducer,
        user: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
const persistor = persistStore(store)
export {store, persistor}