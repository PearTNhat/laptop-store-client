import { configureStore} from "@reduxjs/toolkit";
import { productCategoryReducer } from "./slice/productCategory";
import { productReducer } from "./slice/product";
import storage from "redux-persist/lib/storage";
import { userReducer } from "./slice/userSlice";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig ={
    key:'root',
    storage
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